/*
 * Copyright (C) 2018 Baidu, Inc. All Rights Reserved.
 */
/*
 * Copyright (C) 2018 Baidu, Inc. All Rights Reserved.
 */
/*
 * Copyright (C) 2018 Baidu, Inc. All Rights Reserved.
 */
/*
 * Copyright (C) 2018 Baidu, Inc. All Rights Reserved.
 */
/*
 * Copyright (C) 2018 Baidu, Inc. All Rights Reserved.
 */
/*
 * Copyright (C) 2018 Baidu, Inc. All Rights Reserved.
 */

/* eslint-disable */

let slaveSocketInstance;

const evalCallbacks = {};
const getEvalId = (function () {
    let id = 0;
    return (cb) => {
        const currentId = 'evalID' + (id++);
        evalCallbacks[currentId] = cb;
        return currentId;
    }
})();

const getEvalReturn = (id, val) => {
    const callback = evalCallbacks[id];
    // todo 校验 callback 类型
    if (callback) {
        callback.call(null, val);
        evalCallbacks[id] = null;
    }
};


const init = function () {
    const host = location.host;
    const socket = io('http://' + host, {
        'transports': ['websocket', 'polling']
    });
    // inspector 接收 server 从 master 页面转发过来的消息
    socket.on('server-inspector-message', function (data) {
        if (data && data.from === 'master') {
            console.log('', '   master message:-- ', data);
            const msg = data.msg;
            const type = data.type;
            const slaveId = msg.slaveId;
            // todo 所有的消息类型抽取出来统一定义
            switch (type) {
                case 'new-url':
                    console.log('', ' abilityMessage======  master message:-- ', msg);
                    break;
                case 'eval-return':
                    getEvalReturn(msg.id, msg.val);
                    break;
                case 'slave-loaded':
                    console.log('', '   -slave-loaded- ', slaveId);
                    break;
                case 'slave-visible':
                    let slaveConnection = slaveSocketInstance.getSlaveConnectionBySlaveId(slaveId);
                    const isShow = msg.visible === 'show';
                    if (isShow) {
                        // slaveConnection 已存在，说明是通过 tab 页签跳转回来的页面
                        if (slaveConnection) {
                            slaveConnection['connection'].isActive = true;
                        } else {
                            // 新建的 slave 页面
                            slaveConnection = slaveSocketInstance.connectNewSlaveSocket(slaveId);
                        }
                    } else {
                        if (slaveConnection) {
                            slaveConnection['connection'].isActive = false;
                        } else {
                            // todo 不应该走到这一步
                            console.log('ERROR:   slave 页面 不存在 ', slaveId);
                            return;
                        }
                    }


                    const index = slaveSocketInstance.getConnectionIndexBySlaveId(slaveId) + 1;// 忽略master，所以index+1
                    setElementPanelVisible(index, isShow);
                    break;
                case 'slave-unload':
                    const slaveUnloadConnection = slaveSocketInstance.getSlaveConnectionBySlaveId(slaveId);
                    const unloadConnectionIndex = slaveSocketInstance.getConnectionIndexBySlaveId(slaveId) + 1;
                    slaveSocketInstance.delSlaveConnection(slaveUnloadConnection);
                    delElementPanel(unloadConnectionIndex);
                    break;
                case 'slave-lifecycle':
                    console.log('', '   -slave-lifecycle- ', msg);
                    break;
            }

        }
    });

    // SDK._socket = socket;
    slaveSocketInstance = slaveSocket(SDK);

    const delElementPanel = function (index) {
        if (!index) {
            return;
        }
        const elements = document.querySelectorAll('#elements-content>div');
        const child = elements[index];
        if (child && child.parentNode) {
            child.parentNode.removeChild(child);
        }
    };

    const setElementPanelVisible = function (index, isShow) {
        if (!index) {
            return;
        }
        const elements = document.querySelectorAll('#elements-content>div');
        for (let i = 0, len = elements.length; i < len; i++) {
            const element = elements[i];
            if (isShow) {
                if (i !== index) {
                    element.classList.remove('show');
                    element.classList.add('hide');
                } else {
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            } else if (i === index) {
                element.classList.remove('show');
                element.classList.add('hide');
            }
        }

    };

    // 启动的时候建立第一个 slave 连接 , 默认 slaveId = 10
    // 假设slave页面提前打开了，但是后台的 socket 服务还未启动，因此需要预设第一次打开页面的 slaveId = 10
    slaveSocketInstance.connectNewSlaveSocket(10).then(connection => {
        // 通过 swan api 获取 slave 页面的 slaveId ，更新默认值
        socket.emit('inspector-server-master-message', {
            type: 'eval',
            eval: 'let _slave;\n' +
            '            if (typeof masterManager !== \'undefined\') {\n' +
            '                _slave = masterManager.navigator.history.getTopSlaves()[0];\n' +
            '            } else if (typeof privateSwan !== \'undefined\') {\n' +
            '                _slave = privateSwan.navigator.history.getTopSlaves()[0];\n' +
            '            }\n' +
            '            if (_slave && _slave.currentIndex !== undefined) {\n' +
            '                _slave = _slave.children[_slave.currentIndex];\n' +
            '            }\n' +
            '            slaveId =_slave && _slave.getSlaveId();',
            id: getEvalId(slaveId => {
                connection.slaveId = slaveId;
            })
        });

    });


};

const repeatFn = function () {
    requestAnimationFrame(function () {
        if (document.querySelectorAll('.view-container')[0] != null) {
            init();
        } else {
            repeatFn();
        }
    });
};

repeatFn();

/*eslint-enable*/

