/* eslint-disable */


/* eslint-disable indent */
(function(window) {

  // DevToolsApp ---------------------------------------------------------------

  function installObjectObserve() {
    /** @type {!Array<string>} */
    var properties = [
      'advancedSearchConfig',
      'auditsPanelSplitViewState',
      'auditsSidebarWidth',
      'blockedURLs',
      'breakpoints',
      'cacheDisabled',
      'colorFormat',
      'consoleHistory',
      'consoleTimestampsEnabled',
      'cpuProfilerView',
      'cssSourceMapsEnabled',
      'currentDockState',
      'customColorPalette',
      'customDevicePresets',
      'customEmulatedDeviceList',
      'customFormatters',
      'customUserAgent',
      'databaseTableViewVisibleColumns',
      'dataGrid-cookiesTable',
      'dataGrid-DOMStorageItemsView',
      'debuggerSidebarHidden',
      'disableDataSaverInfobar',
      'disablePausedStateOverlay',
      'domBreakpoints',
      'domWordWrap',
      'elementsPanelSplitViewState',
      'elementsSidebarWidth',
      'emulation.deviceHeight',
      'emulation.deviceModeValue',
      'emulation.deviceOrientationOverride',
      'emulation.deviceScale',
      'emulation.deviceScaleFactor',
      'emulation.deviceUA',
      'emulation.deviceWidth',
      'emulation.geolocationOverride',
      'emulation.showDeviceMode',
      'emulation.showRulers',
      'enableAsyncStackTraces',
      'eventListenerBreakpoints',
      'fileMappingEntries',
      'fileSystemMapping',
      'FileSystemViewSidebarWidth',
      'fileSystemViewSplitViewState',
      'filterBar-consoleView',
      'filterBar-networkPanel',
      'filterBar-promisePane',
      'filterBar-timelinePanel',
      'frameViewerHideChromeWindow',
      'heapSnapshotRetainersViewSize',
      'heapSnapshotSplitViewState',
      'hideCollectedPromises',
      'hideNetworkMessages',
      'highlightNodeOnHoverInOverlay',
      'highResolutionCpuProfiling',
      'inlineVariableValues',
      'Inspector.drawerSplitView',
      'Inspector.drawerSplitViewState',
      'InspectorView.panelOrder',
      'InspectorView.screencastSplitView',
      'InspectorView.screencastSplitViewState',
      'InspectorView.splitView',
      'InspectorView.splitViewState',
      'javaScriptDisabled',
      'jsSourceMapsEnabled',
      'lastActivePanel',
      'lastDockState',
      'lastSelectedSourcesSidebarPaneTab',
      'lastSnippetEvaluationIndex',
      'layerDetailsSplitView',
      'layerDetailsSplitViewState',
      'layersPanelSplitViewState',
      'layersShowInternalLayers',
      'layersSidebarWidth',
      'messageLevelFilters',
      'messageURLFilters',
      'monitoringXHREnabled',
      'navigatorGroupByFolder',
      'navigatorHidden',
      'networkColorCodeResourceTypes',
      'networkConditions',
      'networkConditionsCustomProfiles',
      'networkHideDataURL',
      'networkLogColumnsVisibility',
      'networkLogLargeRows',
      'networkLogShowOverview',
      'networkPanelSplitViewState',
      'networkRecordFilmStripSetting',
      'networkResourceTypeFilters',
      'networkShowPrimaryLoadWaterfall',
      'networkSidebarWidth',
      'openLinkHandler',
      'pauseOnCaughtException',
      'pauseOnExceptionEnabled',
      'preserveConsoleLog',
      'prettyPrintInfobarDisabled',
      'previouslyViewedFiles',
      'profilesPanelSplitViewState',
      'profilesSidebarWidth',
      'promiseStatusFilters',
      'recordAllocationStacks',
      'requestHeaderFilterSetting',
      'request-info-formData-category-expanded',
      'request-info-general-category-expanded',
      'request-info-queryString-category-expanded',
      'request-info-requestHeaders-category-expanded',
      'request-info-requestPayload-category-expanded',
      'request-info-responseHeaders-category-expanded',
      'resources',
      'resourcesLastSelectedItem',
      'resourcesPanelSplitViewState',
      'resourcesSidebarWidth',
      'resourceViewTab',
      'savedURLs',
      'screencastEnabled',
      'scriptsPanelNavigatorSidebarWidth',
      'searchInContentScripts',
      'selectedAuditCategories',
      'selectedColorPalette',
      'selectedProfileType',
      'shortcutPanelSwitch',
      'showAdvancedHeapSnapshotProperties',
      'showEventListenersForAncestors',
      'showFrameowkrListeners',
      'showHeaSnapshotObjectsHiddenProperties',
      'showInheritedComputedStyleProperties',
      'showMediaQueryInspector',
      'showNativeFunctionsInJSProfile',
      'showUAShadowDOM',
      'showWhitespacesInEditor',
      'sidebarPosition',
      'skipContentScripts',
      'skipStackFramesPattern',
      'sourceMapInfobarDisabled',
      'sourcesPanelDebuggerSidebarSplitViewState',
      'sourcesPanelNavigatorSplitViewState',
      'sourcesPanelSplitSidebarRatio',
      'sourcesPanelSplitViewState',
      'sourcesSidebarWidth',
      'standardEmulatedDeviceList',
      'StylesPaneSplitRatio',
      'stylesPaneSplitViewState',
      'textEditorAutocompletion',
      'textEditorAutoDetectIndent',
      'textEditorBracketMatching',
      'textEditorIndent',
      'timelineCaptureFilmStrip',
      'timelineCaptureLayersAndPictures',
      'timelineCaptureMemory',
      'timelineCaptureNetwork',
      'timeline-details',
      'timelineEnableJSSampling',
      'timelineOverviewMode',
      'timelinePanelDetailsSplitViewState',
      'timelinePanelRecorsSplitViewState',
      'timelinePanelTimelineStackSplitViewState',
      'timelinePerspective',
      'timeline-split',
      'timelineTreeGroupBy',
      'timeline-view',
      'timelineViewMode',
      'uiTheme',
      'watchExpressions',
      'WebInspector.Drawer.lastSelectedView',
      'WebInspector.Drawer.showOnLoad',
      'workspaceExcludedFolders',
      'workspaceFolderExcludePattern',
      'workspaceInfobarDisabled',
      'workspaceMappingInfobarDisabled',
      'xhrBreakpoints'
    ];

    /**
     * @this {!{_storage: Object, _name: string}}
     */
    function settingRemove() {
      this._storage[this._name] = undefined;
    }

    /**
     * @param {!Object} object
     * @param {function(!Array<!{name: string}>)} observer
     */
    function objectObserve(object, observer) {
      if (window['WebInspector']) {
        var settingPrototype = /** @type {!Object} */ (window['WebInspector']['Setting']['prototype']);
        if (typeof settingPrototype['remove'] === 'function')
          settingPrototype['remove'] = settingRemove;
      }
      /** @type {!Set<string>} */
      var changedProperties = new Set();
      var scheduled = false;

      function scheduleObserver() {
        if (scheduled)
          return;
        scheduled = true;
        setImmediate(callObserver);
      }

      function callObserver() {
        scheduled = false;
        var changes = /** @type {!Array<!{name: string}>} */ ([]);
        changedProperties.forEach(function(name) {
          changes.push({name: name});
        });
        changedProperties.clear();
        observer.call(null, changes);
      }

      /** @type {!Map<string, *>} */
      var storage = new Map();

      /**
       * @param {string} property
       */
      function defineProperty(property) {
        if (property in object) {
          storage.set(property, object[property]);
          delete object[property];
        }

        Object.defineProperty(object, property, {
          /**
           * @return {*}
           */
          get: function() {
            return storage.get(property);
          },

          /**
           * @param {*} value
           */
          set: function(value) {
            storage.set(property, value);
            changedProperties.add(property);
            scheduleObserver();
          }
        });
      }

      for (var i = 0; i < properties.length; ++i)
        defineProperty(properties[i]);
    }

    window.Object.observe = objectObserve;
  }

  /** @type {!Map<number, string>} */
  var staticKeyIdentifiers = new Map([
    [0x12, 'Alt'],
    [0x11, 'Control'],
    [0x10, 'Shift'],
    [0x14, 'CapsLock'],
    [0x5b, 'Win'],
    [0x5c, 'Win'],
    [0x0c, 'Clear'],
    [0x28, 'Down'],
    [0x23, 'End'],
    [0x0a, 'Enter'],
    [0x0d, 'Enter'],
    [0x2b, 'Execute'],
    [0x70, 'F1'],
    [0x71, 'F2'],
    [0x72, 'F3'],
    [0x73, 'F4'],
    [0x74, 'F5'],
    [0x75, 'F6'],
    [0x76, 'F7'],
    [0x77, 'F8'],
    [0x78, 'F9'],
    [0x79, 'F10'],
    [0x7a, 'F11'],
    [0x7b, 'F12'],
    [0x7c, 'F13'],
    [0x7d, 'F14'],
    [0x7e, 'F15'],
    [0x7f, 'F16'],
    [0x80, 'F17'],
    [0x81, 'F18'],
    [0x82, 'F19'],
    [0x83, 'F20'],
    [0x84, 'F21'],
    [0x85, 'F22'],
    [0x86, 'F23'],
    [0x87, 'F24'],
    [0x2f, 'Help'],
    [0x24, 'Home'],
    [0x2d, 'Insert'],
    [0x25, 'Left'],
    [0x22, 'PageDown'],
    [0x21, 'PageUp'],
    [0x13, 'Pause'],
    [0x2c, 'PrintScreen'],
    [0x27, 'Right'],
    [0x91, 'Scroll'],
    [0x29, 'Select'],
    [0x26, 'Up'],
    [0x2e, 'U+007F'],  // Standard says that DEL becomes U+007F.
    [0xb0, 'MediaNextTrack'],
    [0xb1, 'MediaPreviousTrack'],
    [0xb2, 'MediaStop'],
    [0xb3, 'MediaPlayPause'],
    [0xad, 'VolumeMute'],
    [0xae, 'VolumeDown'],
    [0xaf, 'VolumeUp'],
  ]);

  /**
   * @param {number} keyCode
   * @return {string}
   */
  function keyCodeToKeyIdentifier(keyCode) {
    var result = staticKeyIdentifiers.get(keyCode);
    if (result !== undefined)
      return result;
    result = 'U+';
    var hexString = keyCode.toString(16).toUpperCase();
    for (var i = hexString.length; i < 4; ++i)
      result += '0';
    result += hexString;
    return result;
  }

  function installBackwardsCompatibility() {
    // if (window.location.href.indexOf('/remote/') === -1)
    //   return;

    // Support for legacy (<M65) frontends.
    /** @type {(!function(number, number):Element|undefined)} */
    ShadowRoot.prototype.__originalShadowRootElementFromPoint;

    if (!ShadowRoot.prototype.__originalShadowRootElementFromPoint) {
      ShadowRoot.prototype.__originalShadowRootElementFromPoint = ShadowRoot.prototype.elementFromPoint;
      /**
       *  @param {number} x
       *  @param {number} y
       *  @return {Element}
       */
      ShadowRoot.prototype.elementFromPoint = function(x, y) {
        var originalResult = ShadowRoot.prototype.__originalShadowRootElementFromPoint.apply(this, arguments);
        if (this.host && originalResult === this.host)
          return null;
        return originalResult;
      };
    }

    // Support for legacy (<M53) frontends.
    if (!window.KeyboardEvent.prototype.hasOwnProperty('keyIdentifier')) {
      Object.defineProperty(window.KeyboardEvent.prototype, 'keyIdentifier', {
        /**
         * @return {string}
         * @this {KeyboardEvent}
         */
        get: function() {
          return keyCodeToKeyIdentifier(this.keyCode);
        }
      });
    }

    // Support for legacy (<M50) frontends.
    installObjectObserve();

    /**
     * @param {string} property
     * @return {!CSSValue|null}
     * @this {CSSStyleDeclaration}
     */
    function getValue(property) {
      // Note that |property| comes from another context, so we can't use === here.
      // eslint-disable-next-line eqeqeq
      if (property == 'padding-left') {
        return /** @type {!CSSValue} */ ({
          /**
           * @return {number}
           * @this {!{__paddingLeft: number}}
           */
          getFloatValue: function() {
            return this.__paddingLeft;
          },
          __paddingLeft: parseFloat(this.paddingLeft)
        });
      }
      throw new Error('getPropertyCSSValue is undefined');
    }

    // Support for legacy (<M41) frontends.
    window.CSSStyleDeclaration.prototype.getPropertyCSSValue = getValue;

    function CSSPrimitiveValue() {
    }
    CSSPrimitiveValue.CSS_PX = 5;
    window.CSSPrimitiveValue = CSSPrimitiveValue;

    // Support for legacy (<M44) frontends.
    var styleElement = window.document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.textContent = 'html /deep/ * { min-width: 0; min-height: 0; }';

    // Support for quirky border-image behavior (<M51), see:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=559258
    styleElement.textContent +=
        '\nhtml /deep/ .cm-breakpoint .CodeMirror-linenumber { border-style: solid !important; }';
    styleElement.textContent +=
        '\nhtml /deep/ .cm-breakpoint.cm-breakpoint-conditional .CodeMirror-linenumber { border-style: solid !important; }';
    window.document.head.appendChild(styleElement);

    // Support for legacy (<M49) frontends.
    Event.prototype.deepPath = undefined;

    // Support for legacy (<53) frontends.
    window.FileError = /** @type {!function (new: FileError) : ?} */ ({
      NOT_FOUND_ERR: DOMException.NOT_FOUND_ERR,
      ABORT_ERR: DOMException.ABORT_ERR,
      INVALID_MODIFICATION_ERR: DOMException.INVALID_MODIFICATION_ERR,
      NOT_READABLE_ERR: 0  // No matching DOMException, so code will be 0.
    });
  }


  installBackwardsCompatibility();
  /** @type {(!function(string, boolean=):boolean)|undefined} */
  DOMTokenList.prototype.__originalDOMTokenListToggle;

  if (!DOMTokenList.prototype.__originalDOMTokenListToggle) {
    DOMTokenList.prototype.__originalDOMTokenListToggle = DOMTokenList.prototype.toggle;
    /**
     * @param {string} token
     * @param {boolean=} force
     * @return {boolean}
     */
    DOMTokenList.prototype.toggle = function(token, force) {
      if (arguments.length === 1)
        force = !this.contains(token);
      return this.__originalDOMTokenListToggle(token, !!force);
    };
  }

})(window);

/*eslint-enable*/
