/*
 * Copyright (C) 2018 Baidu, Inc. All Rights Reserved.
 */
/*
 * Copyright (C) 2018 Baidu, Inc. All Rights Reserved.
 */



function slaveSocket(MainInstance) {
    MainInstance.slaveConnections = MainInstance.slaveConnections || [];
    const capabilitiesForSlaveTarget = () => {
        return SDK.Target.Capability.Browser | SDK.Target.Capability.DOM | SDK.Target.Capability.DeviceEmulation |
            SDK.Target.Capability.Emulation | SDK.Target.Capability.Input | SDK.Target.Capability.JS |
            SDK.Target.Capability.Log | SDK.Target.Capability.Network | SDK.Target.Capability.ScreenCapture |
            SDK.Target.Capability.Security | SDK.Target.Capability.Target | SDK.Target.Capability.Tracing |
            SDK.Target.Capability.Inspector;
    };
    // 建立一个连接
    const createSlaveConnection = function (url, isActive) {
        if (isActive === undefined) {
            isActive = true;
        }

        const slaveConnection = {};
        slaveConnection['url'] = url;

        const _createSlaveConnection = params => {

            const onDisconnect = message => {
                console.log('', '-onDisconnect-' + message);
            };
            let wsConnection = new SDK.WebSocketConnection(url, onDisconnect, {
                onMessage: params.onMessage,
                onDisconnect
            });
            wsConnection.isActive = isActive;
            wsConnection.isSlave = true;
            slaveConnection['connection'] = wsConnection;
            return wsConnection;
        };
        SDK.targetManager.createTarget('slave' + Math.random(), 'Slave', capabilitiesForSlaveTarget(), _createSlaveConnection, null);

        MainInstance.slaveConnections.push(slaveConnection);
        return slaveConnection;
    };


    // 获取 slaveConnections 数组顶部的连接
    const getTopSlaveConnection = function () {
        const len = MainInstance.slaveConnections.length;
        return MainInstance.slaveConnections[len - 1];
    };

    // 根据 socketUrl 获取连接
    const getSlaveConnectionBySocketUrl = function (socketUrl) {
        return MainInstance.slaveConnections.find(con => con['url'] === socketUrl);
    };

    // 获取当前活动的连接
    const getActiveSlaveConnection = function () {
        return MainInstance.slaveConnections.find(con => con['connection']['isActive']);
    };

    // 将当前的活动连接设置为非活动
    const unActiveCurrentSlaveConnection = function () {
        const currentConnection = getActiveSlaveConnection();
        if (currentConnection) {
            currentConnection['connection']['isActive'] = false;
        }
    };

    // 根据 slaveId 找到连接
    const getSlaveConnectionBySlaveId = function (id) {
        if (id == undefined) {
            return null;
        }
        return MainInstance.slaveConnections.find(con => con['slaveId'] === id);
    };

    // 根据 slaveId 找到连接在 slaveConnections 数组中的下标
    const getConnectionIndexBySlaveId = function (id) {
        if (id == undefined) {
            return -1;
        }
        return MainInstance.slaveConnections.findIndex(con => con['slaveId'] === id);
    };

    // 根据 slaveId 将连接设置为活动
    const setSlaveConnectionActiveBySalveId = function (id) {
        const connection = getSlaveConnectionBySlaveId(id);
        if (connection) {
            unActiveCurrentSlaveConnection();
            connection['connection'].isActive = true;
            return true;
        }
        return false;
    };


    // 删除 slaveConnections 数组中指定的连接
    const delSlaveConnection = function (connection) {
        const index = MainInstance.slaveConnections.findIndex(con => con === connection);
        if (index > -1) {
            MainInstance.slaveConnections.splice(index, 1);
        }
    };

    const connectNewSlaveSocket = slaveId => new Promise((resolve, reject) => {
        const port = Runtime._queryParamsObject['fport'] || 4000;
        fetch('/json/' + port).then((res) => {
            if (res.ok) {
                let newConnection;
                res.json().then(json => {
                    return json.filter(data => {
                        return JSON.parse(data['description'] || '{}')['attached'];
                    });
                }).then(slavePages => {
                    const len = slavePages.length;
                    for (let i = 0; i < len; i++) {
                        const currentSlavePage = slavePages[i];
                        const webSocketDebuggerUrl = currentSlavePage['webSocketDebuggerUrl'];

                        if (webSocketDebuggerUrl) {
                            // 从接口返回的数组中寻找第一个没有建立 ws 连接的 slave 页面
                            // 如：启动的第一个 slave 页面
                            if (!getSlaveConnectionBySocketUrl(webSocketDebuggerUrl)) {
                                unActiveCurrentSlaveConnection();
                                newConnection = createSlaveConnection(webSocketDebuggerUrl);
                                if (slaveId) {
                                    newConnection.slaveId = slaveId
                                }
                                break;
                            }
                        }
                    }
                    if (newConnection) {
                        resolve(newConnection);
                    } else {
                        reject('slave 页面没有打开');
                    }

                    console.log('', '   -Main.slaveConnections- ', MainInstance.slaveConnections);
                }).catch((e) => {
                    console.log('connectNewSlaveSocket error:', e);
                })
            }
        });


    });


    return {
        createSlaveConnection,
        connectNewSlaveSocket,
        delSlaveConnection,
        setSlaveConnectionActiveBySalveId,

        getActiveSlaveConnection,
        getSlaveConnectionBySlaveId,
        getTopSlaveConnection,
        getConnectionIndexBySlaveId
    };

}





