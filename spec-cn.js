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
        caption: '提示: ' + desc
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
      hideIf: function (ele) {
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
    if (isNaN(result) || result + '' !== value) {
      Xonomy.warnings.push({
        htmlID: ele.htmlID,
        text: '必须是整数!'
      });
      return false;
    }
    return true;
  };

  var getConditionSideAttr = function () {
    return {
      displayName: '条件端',
      menu: attrMenus("默认服务器端"),
      asker: Xonomy.askPicklist,
      askerParameter: [
        {caption: '服务器', value: 'server'},
        {caption: '本地', value: 'local'},
      ],
    };
  };

  var getConditionAttr = function () {
    return {
      displayName: '条件',
      menu: attrMenus("条件不满足时不会显示,格式'条件名:条件值'"),
      asker: Xonomy.askString,
    };
  };

  var getHoverAttr = function () {
    return {
      displayName: '悬浮提示',
      menu: attrMenus("可使用变量,可使用颜色字符$(优先于'悬浮提示引用'属性配置)"),
      asker: Xonomy.askString,
    };
  };

  var getHoverRefAttr = function () {
    return {
      displayName: '悬浮提示引用',
      menu: attrMenus("悬浮提示引用的ID"),
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
          'server': {
            displayName: '是否服务器菜单',
            menu: attrMenus("false时表示本地菜单(默认true)"),
            asker: Xonomy.askPicklist,
            askerParameter: boolParameters,
          },
          'enable': {
            displayName: '是否启用',
            menu: attrMenus('默认true'),
            asker: Xonomy.askPicklist,
            askerParameter: boolParameters,
          },
          'title': {
            displayName: '标题',
            menu: attrMenus('标题(不会转换颜色字符$)', true),
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
              addAttr('是否服务器菜单', 'server', 'true'),
              addAttr('是否启用', 'enable', 'true'),
              addAttr('标题', 'title', ''),
              addAttr('页面上下文', 'pageContext', ''),
              addAttr('列表上下文', 'listContext', ''),
            ]
          },
          {
            caption: '添加子元素',
            menu: [
              addChildEle('添加行列表', '<lines/>'),
              addChildEle('添加悬浮列表', '<hovers/>'),
              addChildEle('添加映射列表', '<maps/>'),
            ]
          },
        ]
      },
      'lines': {
        displayName: '行列表',
        menu: [
          {
            caption: '添加子元素',
            menu: [
              addChildEle('添加行', '<line/>'),
              addChildEle('添加列表', '<list/>'),
              addChildEle('添加导入', '<import path=""/>'),
            ]
          },
          delEle,
        ]
      },
      'hovers': {
        displayName: '悬浮列表',
        menu: [
          {
            caption: '添加子元素',
            menu: [
              addChildEle('添加悬浮提示', '<hover id=""/>'),
            ]
          },
          delEle,
        ]
      },
      'maps': {
        displayName: '映射列表',
        menu: [
          {
            caption: '添加子元素',
            menu: [
              addChildEle('添加映射', '<map name=""/>'),
            ]
          },
          delEle,
        ]
      },
      'line': {
        displayName: '行',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
          'sub': {
            displayName: '所属子菜单',
            menu: attrMenus('默认无所属'),
            asker: Xonomy.askString,
          },
          'align': {
            displayName: '对齐方式',
            menu: attrMenus('默认居中对齐'),
            asker: Xonomy.askPicklist,
            askerParameter: [
              {caption: '向左对齐', value: 'left'},
              {caption: '居中对齐', value: 'center'},
              {caption: '向右对齐', value: 'right'},
            ],
          },
          'alignCenter': {
            displayName: '居中对齐类型',
            menu: attrMenus('只有对齐属性为居中时才有效,默认两端留空'),
            asker: Xonomy.askPicklist,
            askerParameter: [
              {caption: '两端留空(  ooo  )', value: 'spaceBoth'},
              {caption: '在中间留空(o  o  o)', value: 'spaceBetween'},
              {caption: '在周围留空( o o o )', value: 'spaceAround'},
            ],
          },
          'separate': {
            displayName: '行分隔',
            menu: attrMenus('true时会与前面隔一行,默认false(如果是第一行或前面已经有空行则无效果)'),
            asker: Xonomy.askPicklist,
            askerParameter: boolParameters,
          },
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
              addAttr('所属子菜单', 'sub', ''),
              addAttr('对齐方式', 'align', 'center'),
              addAttr('居中对齐类型', 'alignCenter', 'spaceBoth'),
              addAttr('行分隔', 'separate', 'false'),
            ]
          },
          {
            caption: '添加子元素',
            menu: [
              addChildEle('添加容器', '<div/>'),
              addChildEle('添加文本', '<text/>'),
              addChildEle('添加按钮', '<button value=""/>'),
              addChildEle('添加输入', '<input name=""/>'),
              addChildEle('添加子菜单', '<sub/>'),
              addChildEle('添加物品', '<items param=""/>'),
              addChildEle('添加徽章', '<badge/>'),
            ]
          },
          delEle,
        ],
        canDropTo: ['lines', 'list'],
        collapsed: checkCollapsed,
      },
      'list': {
        displayName: '列表',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
          'size': {
            displayName: '页面大小',
            menu: attrMenus('列表页面大小,必须大于等于1'),
            asker: Xonomy.askString,
          },
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
              addAttr('大小', 'size', '10'),
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
        canDropTo: ['lines'],
        collapsed: checkCollapsed,
      },
      'import': {
        displayName: '导入',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
          'path': {
            displayName: '菜单路径',
            menu: attrMenus("导入菜单路径,格式'仓库ID:命名空间:路径'", true),
            asker: Xonomy.askString,
          },
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
            ]
          },
          delEle,
        ],
        canDropTo: ['lines', 'list'],
        collapsed: checkCollapsed,
      },
      'div': {
        displayName: '容器',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
            ]
          },
          {
            caption: '添加子元素',
            menu: [
              addChildEle('添加容器', '<div/>'),
              addChildEle('添加文本', '<text/>'),
              addChildEle('添加按钮', '<button value=""/>'),
              addChildEle('添加输入', '<input name=""/>'),
              addChildEle('添加子菜单', '<sub/>'),
              addChildEle('添加物品', '<items param=""/>'),
              addChildEle('添加徽章', '<badge/>'),
            ]
          },
          delEle,
        ],
        canDropTo: ['line', 'div'],
        asker: Xonomy.askString,
      },
      'text': {
        displayName: '文本',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
        },
        menu: [
          {
            caption: '提示: 可使用变量,可使用颜色字符$'
          },
          {
            caption: '添加属性',
            menu: [
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
            ]
          },
          delEle,
        ],
        hasText: true,
        oneliner: true,
        canDropTo: ['line', 'div'],
        asker: Xonomy.askString,
      },
      'button': {
        displayName: '按钮',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
          'type': {
            displayName: '动作类型',
            menu: attrMenus("按钮动作类型"),
            asker: Xonomy.askPicklist,
            askerParameter: [
              {caption: '执行命令', value: 'cmd'},
              {caption: '打开url', value: 'url'},
              {caption: '打开文件', value: 'file'},
            ],
          },
          'cmdSide': {
            displayName: '命令端',
            menu: attrMenus("只在类型为命令时有效,默认服务端"),
            asker: Xonomy.askPicklist,
            askerParameter: [
              {caption: '服务端', value: 'server'},
              {caption: '本地端', value: 'local'},
            ],
          },
          'value': {
            displayName: '值',
            menu: attrMenus("与动作类型有关,分别为命令内容/url地址/文件地址"),
            asker: Xonomy.askString,
          },
          'mode': {
            displayName: '模式',
            menu: attrMenus("执行按钮后的动作,默认无操作"),
            asker: Xonomy.askPicklist,
            askerParameter: [
              {caption: '退出菜单', value: 'exit'},
              {caption: '返回菜单', value: 'back'},
              {caption: '无操作', value: 'stay'},
              {caption: '刷新页面', value: 'refresh'},
            ]
          },
          'optional': {
            displayName: '可选输入变量',
            menu: attrMenus("可选输入变量列表,多个值以逗号(,)分隔"),
            asker: Xonomy.askString,
          }
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
              addAttr('动作类型', 'type', 'cmd'),
              addAttr('命令端', 'cmdSide', 'server'),
              addAttr('值', 'value', ''),
              addAttr('模式', 'mode', 'stay'),
              addAttr('可选变量', 'optional', ''),
            ]
          },
          delEle,
        ],
        hasText: true,
        oneliner: true,
        canDropTo: ['line', 'div'],
        asker: Xonomy.askString,
      },
      'input': {
        displayName: '输入',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
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
            menu: attrMenus('可使用输入变量'),
            asker: Xonomy.askString,
          },
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
              addAttr('变量名', 'name', ''),
              addAttr('类型', 'type', 'string'),
              addAttr('默认值', 'default', ''),
            ]
          },
          delEle,
        ],
        oneliner: true,
        canDropTo: ['line', 'div'],
      },
      'sub': {
        displayName: '子菜单',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
          'name': {
            displayName: '子菜单名',
            menu: attrMenus('默认为空,空也是正常的值(不能包含@符号)'),
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
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
              addAttr('子菜单名', 'name', ''),
              addAttr('初始状态', 'default', 'closed'),
              addAttr('所属子菜单组', 'group', ''),
            ]
          },
          delEle,
        ],
        oneliner: true,
        canDropTo: ['line', 'div'],
      },
      'items': {
        displayName: '物品',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
          'showHover': {
            displayName: '显示悬浮提示',
            menu: attrMenus('是否显示物品的悬浮提示,默认true'),
            asker: Xonomy.askPicklist,
            askerParameter: boolParameters,
          },
          'side': {
            displayName: '物品端',
            menu: attrMenus("物品所属的端,默认服务端"),
            asker: Xonomy.askPicklist,
            askerParameter: [
              {caption: '服务端', value: 'server'},
              {caption: '本地端', value: 'local'},
            ]
          },
          'param': {
            displayName: '变量',
            menu: attrMenus("格式'物品处理器名[:物品处理器数据]'(可以包含命令变量,只会在开始的时候解析一次)"),
            asker: Xonomy.askString,
          },
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
              addAttr('显示悬浮提示', 'showHover', 'true'),
              addAttr('物品端', 'side', 'server'),
              addAttr('变量', 'param', ''),
            ]
          },
          delEle,
        ],
        oneliner: true,
        canDropTo: ['line', 'div'],
      },
      'badge': {
        displayName: '徽章',
        attributes: {
          'conditionSide': getConditionSideAttr(),
          'condition': getConditionAttr(),
          'hover': getHoverAttr(),
          'hoverRef': getHoverRefAttr(),
          'color': {
            displayName: '背景颜色',
            menu: attrMenus("默认'a'"),
            asker: Xonomy.askPicklist,
            askerParameter: [
              {caption: '0', value: '0'},
              {caption: '1', value: '1'},
              {caption: '2', value: '2'},
              {caption: '3', value: '3'},
              {caption: '4', value: '4'},
              {caption: '5', value: '5'},
              {caption: '6', value: '6'},
              {caption: '7', value: '7'},
              {caption: '8', value: '8'},
              {caption: '9', value: '9'},
              {caption: 'a', value: 'a'},
              {caption: 'b', value: 'b'},
              {caption: 'c', value: 'c'},
              {caption: 'd', value: 'd'},
              {caption: 'e', value: 'e'},
              {caption: 'f', value: 'f'},
            ],
          },
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('条件端', 'conditionSide', 'local'),
              addAttr('条件', 'condition', ''),
              addAttr('悬浮提示', 'hover', ''),
              addAttr('悬浮提示引用', 'hoverRef', ''),
              addAttr('背景颜色', 'color', 'a'),
            ]
          },
          delEle,
        ],
        oneliner: true,
        canDropTo: ['line', 'div'],
      },
      'hover': {
        displayName: '悬浮提示',
        attributes: {
          'id': {
            displayName: '悬浮提示ID',
            menu: attrMenus('', true),
            asker: Xonomy.askString,
          },
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('悬浮提示ID', 'id', ''),
            ]
          },
          {
            caption: '添加子元素',
            menu: [
              addChildEle('添加行', '<hoverLine/>'),
            ]
          },
          delEle,
        ],
        canDropTo: ['hovers'],
      },
      'hoverLine': {
        displayName: '悬浮提示行',
        menu: [
          {
            caption: '提示: 可使用变量,可使用颜色字符$'
          },
          delEle,
        ],
        hasText: true,
        oneliner: true,
        canDropTo: ['hover'],
        asker: Xonomy.askString,
      },
      'map': {
        displayName: '映射',
        attributes: {
          'name': {
            displayName: '映射名',
            menu: attrMenus('', true),
            asker: Xonomy.askString,
          },
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('映射名', 'name', ''),
            ]
          },
          {
            caption: '添加子元素',
            menu: [
              addChildEle('添加映射值', '<mapValue/>'),
            ]
          },
          delEle,
        ],
        canDropTo: ['maps'],
      },
      'mapValue': {
        displayName: '映射值',
        attributes: {
          'key': {
            displayName: '键',
            menu: attrMenus('未设置时为null,null会匹配任意键(空字符串也是正常的键,会匹配空字符串)'),
            asker: Xonomy.askString,
          },
        },
        menu: [
          {
            caption: '添加属性',
            menu: [
              addAttr('键', 'key', ''),
            ]
          },
          delEle,
        ],
        hasText: true,
        oneliner: true,
        canDropTo: ['map'],
        asker: Xonomy.askString,
      },
    },
    onchange: function () {
      console.log("onchange...")
    },
    validate: function (ele) {
      console.log("validate...")

      //最多1个行列表
      var linesArray = ele.getDescendantElements('lines');
      if (linesArray.length > 1) {
        Xonomy.warnings.push({
          htmlID: linesArray[linesArray.length-1].htmlID,
          text: '最多只能有一个行列表!'
        });
      }

      //最多1个悬浮列表
      var hoversArray = ele.getDescendantElements('hovers');
      if (hoversArray.length > 1) {
        Xonomy.warnings.push({
          htmlID: hoversArray[hoversArray.length-1].htmlID,
          text: '最多只能有一个悬浮列表!'
        });
      }

      //最多1个映射列表
      var mapsArray = ele.getDescendantElements('maps');
      if (mapsArray.length > 1) {
        Xonomy.warnings.push({
          htmlID: mapsArray[mapsArray.length-1].htmlID,
          text: '最多只能有一个映射列表!'
        });
      }

      //最多1个列表
      var listArray = ele.getDescendantElements('list');
      if (listArray.length > 1) {
        Xonomy.warnings.push({
          htmlID: listArray[listArray.length-1].htmlID,
          text: '最多只能有一个列表!'
        });
      }

      //列表的size必须是整数且>=1
      if (listArray.length > 0) {
        var sizeAttr = listArray[0].getAttribute('size');
        if (sizeAttr !== undefined && sizeAttr !== null) {
          //验证整数
          if (validateInt(sizeAttr, sizeAttr.value)) {
            //必须大于等于1
            var size = parseInt(sizeAttr.value);
            if (size < 1) {
              Xonomy.warnings.push({
                htmlID: sizeAttr.htmlID,
                text: '必须大于等于1!'
              });
            }
          }
        }
      }
    }
  };
})();