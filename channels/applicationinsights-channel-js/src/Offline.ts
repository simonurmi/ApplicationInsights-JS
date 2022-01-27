import { getWindow, getDocument, getNavigator, isUndefined, isNullOrUndefined, createUniqueNamespace, mergeEvtNamespace, eventOn, eventOff } from "@microsoft/applicationinsights-core-js";

export interface IOfflineListener {
    isOnline: () => boolean;
    isListening: () => boolean;
    unload: () => void;
}

/**
 * Create a new OfflineListener instance to monitor browser online / offline events
 * @param parentEvtNamespace - The parent event namespace to append to any specific events for this instance
 */
export function createOfflineListener(parentEvtNamespace?: string | string[]): IOfflineListener {
    let _window = getWindow();
    let _document = getDocument();
    var _navigator = getNavigator();        // Gets the window.navigator or workerNavigator depending on the global
    let _isListening: boolean = false;
    let _onlineStatus: boolean = true;
    let _evtNamespace = mergeEvtNamespace(createUniqueNamespace("OfflineListener"), parentEvtNamespace);

    try {
        if (_enableEvents(_window)) {
            _isListening = true;
        }
        
        if (_document) {
            // Also attach to the document.body or document
            let target:any = _document.body || _document;

            if (target.ononline) {
                if (_enableEvents(target)) {
                    _isListening = true;
                }
            }
        }

        if (_isListening) {
            // We are listening to events so lets set the current status rather than assuming we are online #1538
            if (_navigator && !isNullOrUndefined(_navigator.onLine)) { // navigator.onLine is undefined in react-native
                _onlineStatus = _navigator.onLine;
            }
        }
    } catch (e) {
        // this makes react-native less angry
        _isListening = false;
    }

    function _enableEvents(target: any): boolean {
        let enabled = false;
        if (target) {
            enabled = eventOn(target, "online", _setOnline, _evtNamespace);
            if (enabled) {
                eventOn(target, "offline", _setOffline, _evtNamespace);
            }
        }

        return enabled;
    }

    function _disableEvents(target: any) {
        eventOff(target, "online", _setOnline, _evtNamespace);
        eventOff(target, "offline", _setOffline, _evtNamespace);
    }

    function _setOnline() {
        _onlineStatus = true;
    }

    function _setOffline() {
        _onlineStatus = false;
    }

    function _isOnline(): boolean {
        let result = true;
        if (_isListening) {
            result = _onlineStatus
        } else if (_navigator && !isNullOrUndefined(_navigator.onLine)) { // navigator.onLine is undefined in react-native
            result = _navigator.onLine;
        }

        return result;
    }

    function _unload() {
        if (_window && _isListening) {
            _disableEvents(_window);

            // Also attach to the document.body or document
            let target:any = _document.body || _document;
            if (!isUndefined(target.ononline)) {
                _disableEvents(target);
            }

            _isListening = false;
        }
    }

    return {
        isOnline: _isOnline,
        isListening: () => _isListening,
        unload: _unload
    };
}
