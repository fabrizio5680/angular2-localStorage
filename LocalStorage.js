"use strict";
var LocalStorageEmitter_1 = require('./LocalStorageEmitter');
function LocalStorage(storageKey) {
    var _this = this;
    return function (target, decoratedPropertyName) {
        if (!localStorage) {
            return;
        }
        if (!storageKey) {
            storageKey = '' + '/' + decoratedPropertyName;
        }
        Object.defineProperty(target, '_' + decoratedPropertyName + '_mapped', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: false
        });
        var instances = [];
        var values = {};
        var storageValue = localStorage.getItem(storageKey) || null;
        var storageValueJSON = storageValue;
        if ('string' === typeof storageValue) {
            try {
                storageValue = JSON.parse(storageValue);
            }
            catch (e) {
                storageValue = null;
                storageValueJSON = 'null';
            }
        }
        var oldJSONValues = {};
        Object.defineProperty(target, decoratedPropertyName, {
            get: function () {
                if (false === this['_' + decoratedPropertyName + '_mapped']) {
                    this['_' + decoratedPropertyName + '_mapped'] = instances.length;
                    values[instances.length] = storageValue;
                    oldJSONValues[instances.length] = storageValueJSON;
                    instances.push(this);
                }
                return values[this['_' + decoratedPropertyName + '_mapped']];
            },
            set: function (newValue) {
                if (false === this['_' + decoratedPropertyName + '_mapped']) {
                    this['_' + decoratedPropertyName + '_mapped'] = instances.length;
                    values[instances.length] = storageValue;
                    oldJSONValues[instances.length] = storageValueJSON;
                    instances.push(this);
                    if (storageValue) {
                        return;
                    }
                }
                values[this['_' + decoratedPropertyName + '_mapped']] = newValue;
            },
            enumerable: true,
            configurable: true
        });
        LocalStorageEmitter_1.LocalStorageEmitter.subscribe(function () {
            for (var _i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                var instance = instances_1[_i];
                var currentValue = JSON.stringify(instance[decoratedPropertyName]);
                var oldJSONValue = oldJSONValues[_this['_' + decoratedPropertyName + '_mapped']];
                if (currentValue !== oldJSONValue) {
                    oldJSONValues[_this['_' + decoratedPropertyName + '_mapped']] = currentValue;
                    localStorage.setItem(storageKey, currentValue);
                }
            }
        });
    };
}
exports.LocalStorage = LocalStorage;
//# sourceMappingURL=LocalStorage.js.map