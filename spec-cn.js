window.docSpec = (function () {
    /**
     * 删除属性
     */
    var delAttr = {
        caption: '删除',
        action: Xonomy.deleteAttribute
    };

    /**
     * 删除元素
     */
    var delEle = {
        caption: '删除',
        action: Xonomy.deleteElement
    };

    /**
     * @param desc 属性描述,可选
     * @param noDel true时禁止删除按钮
     */
    var attrMenus = function (desc, noDel) {
        var result = [];
        if (desc) {
            result.push({
                caption: '提示: '+desc
            });
        }
        if (!noDel) {
            result.push(delAttr);
        }
        return result;
    };

    var boolParameters = [
        {caption: '是', value: 'true'},
        {caption: '否', value: 'false'}
    ];

    /**
     * 添加属性
     * @param caption 标题
     * @param name 属性名
     * @param value 初始值
     * @return {{caption: *, action: *, actionParameter: {name: *, value: *}, hideIf: hideIf}}
     */
    var addAttr = function (caption, name, value) {
        return {
            caption: caption,
            action: Xonomy.newAttribute,
            actionParameter: {name: name, value: value},
            hideIf: function(ele){
                return ele.hasAttribute(name);
            }
        };
    };

    /**
     * 添加子元素
     * @param caption 标题
     * @param {string} ele 添加的元素内容
     * @return {{caption: *, action: *, actionParameter: *}}
     */
    var addChildEle = function (caption, ele) {
        return {
            caption: caption,
            action: Xonomy.newElementChild,
            actionParameter: ele
        };
    };

    var validateInt = function (ele, value) {
        var result = parseInt(value);
        if (isNaN(result) || result+'' !== value) {
            Xonomy.warnings.push({
                htmlID: ele.htmlID,
                text: '必须是整数'
            });
            return false;
        }
        return true;
    };

    var getConditionAttr = function () {
        return {
            displayName: '条件',
            menu: attrMenus("条件不满足时不会显示,格式'条件名:条件值'"),
            asker: Xonomy.askString,
        };
    };

    var getStyleAttr = function () {
        return {
            displayName: '样式',
            menu: attrMenus(),
            asker: Xonomy.askString,
        };
    };

    /**
     * 检测初始折叠
     */
    var checkCollapsed = function (ele) {
        return ele.parent().name === 'menu';
    };

    return {
        elements: {
            'menu': {
                displayName: '菜单',
                attributes: {
                    'condition': {
                        displayName: '条件',
                        menu: attrMenus("条件不满足时无法进入菜单,格式'条件名:条件值'"),
                        asker: Xonomy.askString,
                    },
                    'enable': {
                        displayName: '是否启用',
                        menu: attrMenus('默认true'),
                        asker: Xonomy.askPicklist,
                        askerParameter: boolParameters,
                    },
                    'title': {
                        displayName: '标题',
                        menu: attrMenus('标题', true),
                        asker: Xonomy.askString,
                    },
                    'pageContext': {
                        displayName: '页面上下文',
                        menu: attrMenus("格式'页面变量处理器名[:页面变量处理器数据]'"),
                        asker: Xonomy.askString,
                    },
                    'listContext': {
                        displayName: '列表上下文',
                        menu: attrMenus("格式'列表变量处理器名[:列表变量处理器数据]'"),
                        asker: Xonomy.askString,
                    }
                },
                menu: [
                    {
                        caption: '添加属性',
                        menu: [
                            addAttr('条件', 'condition', ''),
                            addAttr('是否启用', 'enable', 'true'),
                            addAttr('标题', 'title', ''),
                            addAttr('页面上下文', 'pageContext', ''),
                            addAttr('列表上下文', 'listContext', ''),
                        ]
                    },
                    {
                        caption: '添加子元素',
                        menu: [
                            addChildEle('添加行', '<line/>'),
                            addChildEle('添加列表', '<list/>'),
                            addChildEle('添加导入', '<import path=""/>'),
                        ]
                    },

                ]
            },
            'line': {
                displayName: '行',
                attributes: {
                    'condition': getConditionAttr(),
                    'description': {
                        displayName: '描述',
                        menu: attrMenus('多行以\\n分隔'),
                        asker: Xonomy.askString,
                    },
                    'sub': {
                        displayName: '所属子菜单',
                        menu: attrMenus('默认无所属'),
                        asker: Xonomy.askString,
                    }
                },
                menu: [
                    {
                        caption: '添加属性',
                        menu: [
                            addAttr('条件', 'condition', ''),
                            addAttr('描述', 'description', ''),
                            addAttr('所属子菜单', 'sub', ''),
                        ]
                    },
                    {
                        caption: '添加子元素',
                        menu: [
                            addChildEle('添加文本', '<text/>'),
                            addChildEle('添加按钮', '<button cmd=""/>'),
                            addChildEle('添加输入', '<input name=""/>'),
                            addChildEle('添加子菜单', '<sub/>'),
                        ]
                    },
                    delEle,
                ],
                canDropTo: ['menu', 'list'],
                collapsed: checkCollapsed,
            },
            'list': {
                displayName: '列表',
                attributes: {
                    'condition': getConditionAttr(),
                    'size': {
                        displayName: '大小',
                        menu: attrMenus('列表大小,必须大于等于1'),
                        asker: Xonomy.askString,
                    },
                    'sub': {
                        displayName: '所属子菜单',
                        menu: attrMenus('默认无'),
                        asker: Xonomy.askString,
                    }
                },
                menu: [
                    {
                        caption: '添加属性',
                        menu: [
                            addAttr('条件', 'condition', ''),
                            addAttr('大小', 'size', '10'),
                            addAttr('所属子菜单', 'sub', ''),
                        ]
                    },
                    {
                        caption: '添加子元素',
                        menu: [
                            addChildEle('添加行', '<line/>'),
                            addChildEle('添加导入', '<import path=""/>'),
                        ]
                    },
                    delEle,
                ],
                canDropTo: ['menu'],
                collapsed: checkCollapsed,
            },
            'import': {
                displayName: '导入',
                attributes: {
                    'condition': getConditionAttr(),
                    'path': {
                        displayName: '菜单路径',
                        menu: attrMenus("导入的菜单路径,格式'[命名空间:]菜单路径'", true),
                        asker: Xonomy.askString,
                    },
                },
                menu: [
                    {
                        caption: '添加属性',
                        menu: [
                            addAttr('条件', 'condition', ''),
                        ]
                    },
                    delEle,
                ],
                canDropTo: ['menu', 'list'],
                collapsed: checkCollapsed,
            },
            'text': {
                displayName: '文本',
                attributes: {
                    'condition': getConditionAttr(),
                    'style': getStyleAttr(),
                },
                menu: [
                    {
                        caption: '添加属性',
                        menu: [
                            addAttr('条件', 'condition', ''),
                            addAttr('样式', 'style', ''),
                        ]
                    },
                    delEle,
                ],
                hasText: true,
                oneliner: true,
                canDropTo: ['line'],
                asker: Xonomy.askString,
            },
            'button': {
                displayName: '按钮',
                attributes: {
                    'condition': getConditionAttr(),
                    'style': getStyleAttr(),
                    'cmd': {
                        displayName: '命令',
                        menu: attrMenus("默认为空,将不会执行命令"),
                        asker: Xonomy.askString,
                    },
                    'mode': {
                        displayName: '模式',
                        menu: attrMenus("执行按钮后的动作,默认为stay"),
                        asker: Xonomy.askPicklist,
                        askerParameter: [
                            {caption: '退出菜单', value: 'exit'},
                            {caption: '返回菜单', value: 'back'},
                            {caption: '无操作', value: 'stay'},
                            {caption: '刷新页面', value: 'refresh'},
                        ]
                    },
                    'optional': {
                        displayName: '可选变量',
                        menu: attrMenus("可选输入变量列表,多个值以','分隔"),
                        asker: Xonomy.askString,
                    }
                },
                menu: [
                    {
                        caption: '添加属性',
                        menu: [
                            addAttr('条件', 'condition', ''),
                            addAttr('样式', 'style', ''),
                            addAttr('命令', 'cmd', ''),
                            addAttr('模式', 'mode', 'stay'),
                            addAttr('可选变量', 'optional', ''),
                        ]
                    },
                    delEle,
                ],
                hasText: true,
                oneliner: true,
                canDropTo: ['line'],
                asker: Xonomy.askString,
            },
            'input': {
                displayName: '输入',
                attributes: {
                    'condition': getConditionAttr(),
                    'style': getStyleAttr(),
                    'name': {
                        displayName: '变量名',
                        menu: attrMenus(),
                        asker: Xonomy.askString,
                    },
                    'type': {
                        displayName: '类型',
                        menu: attrMenus("变量类型限制"),
                        asker: Xonomy.askPicklist,
                        askerParameter: [
                            {caption: '整数', value: 'integer'},
                            {caption: '实数', value: 'real'},
                            {caption: '字符串', value: 'string'},
                        ]
                    },
                    'default': {
                        displayName: '默认值',
                        menu: attrMenus(),
                        asker: Xonomy.askString,
                    },
                },
                menu: [
                    {
                        caption: '添加属性',
                        menu: [
                            addAttr('变量名', 'name', ''),
                            addAttr('条件', 'condition', ''),
                            addAttr('样式', 'style', ''),
                            addAttr('类型', 'type', 'string'),
                            addAttr('默认值', 'default', ''),
                        ]
                    },
                    delEle,
                ],
                oneliner: true,
                canDropTo: ['line'],
            },
            'sub': {
                displayName: '子菜单',
                attributes: {
                    'condition': getConditionAttr(),
                    'style': getStyleAttr(),
                    'name': {
                        displayName: '子菜单名',
                        menu: attrMenus('默认为空,空也是正常的值(不能包含@@)'),
                        asker: Xonomy.askString,
                    },
                    'default': {
                        displayName: '初始状态',
                        menu: attrMenus('默认关闭'),
                        asker: Xonomy.askPicklist,
                        askerParameter: [
                            {caption: '开启', value: 'open'},
                            {caption: '关闭', value: 'closed'},
                        ]
                    },
                    'group': {
                        displayName: '所属子菜单组',
                        menu: attrMenus('默认无组'),
                        asker: Xonomy.askString,
                    },
                },
                menu: [
                    {
                        caption: '添加属性',
                        menu: [
                            addAttr('条件', 'condition', ''),
                            addAttr('样式', 'style', ''),
                            addAttr('子菜单名', 'name', ''),
                            addAttr('初始状态', 'default', 'closed'),
                            addAttr('所属子菜单组', 'group', ''),
                        ]
                    },
                    delEle,
                ],
                oneliner: true,
                canDropTo: ['line'],
            },
        },
        onchange: function () {
            console.log("onchange...")
        },
        validate: function (ele) {
            console.log("validate...")

            //列表的size必须是整数且>=1
            var children = ele.getChildElements('list');
            for (var i in children) {
                if (children.hasOwnProperty(i)) {
                    var child = children[i];
                    var sizeAttr = child.getAttribute('size');
                    if (sizeAttr !== undefined && sizeAttr !== null) {
                        //验证整数
                        if (!validateInt(sizeAttr, sizeAttr.value)) {
                            continue;
                        }
                        //必须大于等于1
                        var size = parseInt(sizeAttr.value);
                        if (size < 1) {
                            Xonomy.warnings.push({
                                htmlID: sizeAttr.htmlID,
                                text: '必须大于等于1'
                            });
                            continue;
                        }
                    }
                }
            }
        }
    };
})();