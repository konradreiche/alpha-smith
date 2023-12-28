var AlphaSmith = React.createClass({displayName: "AlphaSmith",
  getInitialState: function() {
    return {hex: '#ed1c24', bgHex: '#ffffff', alpha: 50};
  },
  compute: function(hex, bgHex, alpha) {
    var rgb = this.hexToRgb(hex);
    var bgRgb = this.hexToRgb(bgHex);

    var red = this.blendAlpha(rgb.red, alpha, bgRgb.red);
    var green = this.blendAlpha(rgb.green, alpha, bgRgb.green);
    var blue = this.blendAlpha(rgb.blue, alpha, bgRgb.blue);

    return this.rgbToHex(red, green, blue);
  },
  hexToRgb: function(hex) {
    hex = hex.replace('#', '');
    var bigInt = parseInt(hex, 16);
    var r = (bigInt >> 16) & 255;
    var g = (bigInt >> 8) & 255;
    var b = bigInt & 255;

    return {red: r, green: g, blue: b};
  },
  rgbToHex: function(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  },
  componentToHex: function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  },
  blendAlpha: function(value, alpha, background) {
    return Math.round(alpha / 100 * value + (1 - alpha / 100) * background);
  },
  updateHex: function(nextState) {
    this.setState({hex: nextState.hex, bgHex: nextState.bgHex});
  },
  updateAlpha: function(nextState) {
    this.setState({alpha: nextState.alpha});
  },
  render: function() {
    var color = this.compute(this.state.hex, this.state.bgHex, this.state.alpha);
    var colors = [];

    for (var i = 0; i <= 100; i += 1) {
      var result = this.compute(this.state.hex, this.state.bgHex, i);
      colors.push({rgb: this.hexToRgb(result), hex: result, alpha: i});
    }

    colors.reverse();

    return (
      React.createElement("div", {className: "alphaSmith"}, 
        React.createElement("div", {className: "input"}, 
          React.createElement(HexInputs, {onChange: this.updateHex}), 
          React.createElement(AlphaInput, {onChange: this.updateAlpha})
        ), 
        React.createElement(Result, {color: color}), 
        React.createElement("h3", null, "Reference Table"), 
        React.createElement(ReferenceTable, {hex: this.state.hex, bgHex: this.state.bgHex, colors: colors})
      )
    );
  }
});

var HexInputs = React.createClass({displayName: "HexInputs",
  getInitialState: function() {
    return {hex: '#ed1c24', bgHex: '#ffffff'};
  },
  handleChange: function(e) {
    e.preventDefault();
    var hex = React.findDOMNode(this.refs.inputHex).value;
    var bgHex = React.findDOMNode(this.refs.inputBgHex).value;

    var nextState = {hex: hex, bgHex: bgHex};

    this.setState(nextState);
    this.props.onChange(nextState);
  },
  render: function() {
    return (
        React.createElement("div", {className: "hexInputs"}, 
          React.createElement("label", null, "Color Hex"), 
          React.createElement("input", {type: "text", placeholder: "#ffffff", ref: "inputHex", value: this.state.hex, onChange: this.handleChange}), 
          React.createElement("div", {className: "color", style: {'backgroundColor': this.state.hex}}), 
          React.createElement("label", null, "Backgroud Color Hex"), 
          React.createElement("input", {type: "text", placeholder: "#ffffff", ref: "inputBgHex", value: this.state.bgHex, onChange: this.handleChange}), 
          React.createElement("div", {className: "color", style: {'backgroundColor': this.state.bgHex}})
        )
    );
  }
});

var AlphaInput = React.createClass({displayName: "AlphaInput",
  getInitialState: function() {
    return {alpha: 50};
  },
  handleSlider: function() {
    var value = React.findDOMNode(this.refs.alphaSlider).value;
    var nextState = {alpha: value};
    this.props.onChange(nextState);
    this.setState(nextState);
  },
  handleInput: function() {
    var value = React.findDOMNode(this.refs.alphaNumeric).value;
    var nextState = {alpha: value};
    this.props.onChange(nextState);
    this.setState(nextState);
  },
  render: function() {
    return (
      React.createElement("div", {className: "alphaInput"}, 
        React.createElement("label", null, "Opacity %"), 
        React.createElement("input", {type: "text", value: this.state.alpha, ref: "alphaNumeric", onChange: this.handleInput}), 
        React.createElement("input", {type: "range", min: "0", max: "100", step: "1", ref: "alphaSlider", value: this.state.alpha, onChange: this.handleSlider})
      )
    );
  }
});

var Result = React.createClass({displayName: "Result",
  render: function() {
    return (
      React.createElement("div", {className: "result"}, 
        React.createElement("label", null, "Result"), 
        React.createElement("input", {type: "text", value: this.props.color, readonly: true}), 
        React.createElement("div", {className: "color result-color", style: {'backgroundColor': this.props.color}})
      )
    );
  }
});

var TableRow = React.createClass({displayName: "TableRow",
  render: function() {
    return (
      React.createElement("tr", null, 
        React.createElement("td", null, "(", this.props.red, ",", this.props.green, ",", this.props.blue, ")"), 
        React.createElement("td", {className: "color-cell", style: {'backgroundColor': this.props.hex}}), 
        React.createElement("td", null, this.props.hex), 
        React.createElement("td", null, this.props.alpha)
      )
    );
  }
});

var ReferenceTable = React.createClass({displayName: "ReferenceTable",
  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.hex !== nextProps.hex || this.props.bgHex !== nextProps.bgHex;
  },
  render: function() {
    var rows = [];
    this.props.colors.forEach(function(color) {
      rows.push(React.createElement(TableRow, {red: color.rgb.red, blue: color.rgb.blue, green: color.rgb.green, hex: color.hex, alpha: color.alpha}));
    });

    return (
      React.createElement("table", null, 
        React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", null, "RGB"), 
            React.createElement("th", null, "Color"), 
            React.createElement("th", null, "Hex"), 
            React.createElement("th", null, "Opacity")
          )
        ), 
        React.createElement("tbody", null, 
          rows
        )
      )
    );
  }
});

React.render(
  React.createElement(AlphaSmith, null),
  document.getElementById('main')
);
