module.exports = {
  "presets": [[
    "@babel/preset-env", {
      "useBuiltIns": "entry",
      'corejs': '3.6.5',
    }],
    "@babel/preset-react"],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-export-default-from",
    "react-hot-loader/babel"
  ]
}