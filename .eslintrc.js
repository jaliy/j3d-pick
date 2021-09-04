module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        commonjs: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: "module"
    },
    plugins: [
        "react",
        "@typescript-eslint"
    ],
    rules: {
        // 允许空函数
        "no-empty-function": 0,
        "keyword-spacing": 2,
        // 行末必须空格
        "semi": 2,
        // 不允许函数名和括号中间有空格
        "no-spaced-func": 2,
        // 缩进4个空格
        "indent": [2, 4],
        // 不允许在对象文字中使用重复键
        "no-dupe-keys": 2,
        "no-extra-parens": 2,
        // 不允许在行尾添加尾随空白（空格，制表符和其他Unicode空白字符）
        "no-trailing-spaces": 1,
        // 不允许嵌套的三元表达式
        "no-nested-ternary": 2,
        // 不应该给函数的参数做赋值操作
        "no-param-reassign": 1,
        // 不应该有局部变量与其包含范围内的变量名称相同
        "no-shadow": 0,
        // return、throw、continu、break后不允许有代码语句
        "no-unreachable": 2,
        // 禁止使用with
        "no-with": 2,
        // 无论参数有几个，箭头函数参数必须加上括号
        "arrow-parens": 1,
        // 箭头函数的箭头左右必须有空格
        "arrow-spacing": 2,
        // 不允许对象文字中的有尾随逗号 { obj: 'ds'}
        "comma-dangle": [2, "never"],
        // 当一个块只包含一条语句时，JavaScript 不允许省略花括号
        "curly": [2, "all"],
        // 必须使用 === 或者 !==
        "eqeqeq": 2,
        // 对象的key: value中，冒号右边需要有空格
        "key-spacing": [1, { "beforeColon": false, "afterColon": true }],
        // 大括号左边必须空格
        "space-before-blocks": 2,
        // 运算符左右两边必须有空格
        "space-infix-ops": 2,
        // 注释应该有空格
        "spaced-comment": 1,
        // 行尾不允许写注释
        "line-comment-position": 2,
        "@typescript-eslint/no-explicit-any": 1,
        "@typescript-eslint/no-empty-function": 0,
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/no-empty-interface": 0,
        "@typescript-eslint/no-shadow": [2]
    }
};
