/*
 * Copyright (C) 2018 Baidu, Inc. All Rights Reserved.
 */


SDK.DOMModel.SanDOMModel = {

    _filterNode: function (node) {
        if (node.nodeName.indexOf('SWAN') === -1
            && node.nodeName !== 'SCROLL-VIEW'
            && node.nodeName !== 'DIV'
            && node.nodeName !== '#text') {
            return true;
        }
        return false;
    },
    _findBody: function (node) {
        var body;
        if (node.localName === 'body') {
            body = node;
        } else if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                var _body = this._findBody(node.children[i]);
                if (_body) {
                    body = _body;
                    continue;
                }
            }
        }
        return body;
    },
    _processAttribute: function (attributes) {
        for (var i = 0; i < attributes.length; i += 2) {
            var key = attributes[i], value = attributes[i + 1];
            if ((key === 'id' && value.indexOf('_san_') !== -1) || value === '') {
                attributes.splice(i, 2);
                i -= 2;
            }
            if (key === 'class') {
                attributes[i + 1] = value.trim();
            }
        }
    },

    setChildNodes: function (payloads) {
        var nodes = payloads;
        for (var i = 0; i < nodes.length; i++) {
            var child = nodes[i];
            if (this._filterNode(child)) {
                nodes.splice(i, 1);
                i--;
                continue;
            }


            child.nodeName = child.nodeName.replace('SWAN-', '');
            child.localName = child.localName.replace('swan-', '');
            if(child.attributes){
                this._processAttribute(child.attributes);
            }

        }
    },
    setDocument: function (payload) {
        var children = payload.children;
        var body;
        for (var i = 0; i < children.length; i++) {
            var _body = this._findBody(children[i]);
            if (_body) {
                body = _body;
                break;
            }
        }
        if (body) {
            body.nodeName = 'page';
            body.localName = 'page';
            payload.children = [body];
        }
    },


}