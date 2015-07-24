var AlphaSmith = React.createClass({
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
      <div className="alphaSmith">
        <div className="input">
          <HexInputs onChange={this.updateHex} />
          <AlphaInput onChange={this.updateAlpha} />
        </div>
        <Result color={color} />
        <h3>Reference Table</h3>
        <ReferenceTable hex={this.state.hex} bgHex={this.state.bgHex} colors={colors} />
      </div>
    );
  }
});

var HexInputs = React.createClass({
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
        <div className="hexInputs">
          <label>Color Hex</label>
          <input type="text" placeholder="#ffffff" ref="inputHex" value={this.state.hex} onChange={this.handleChange} />
          <div className="color" style={{'backgroundColor': this.state.hex}} />
          <label>Backgroud Color Hex</label>
          <input type="text" placeholder="#ffffff" ref="inputBgHex" value={this.state.bgHex} onChange={this.handleChange} />
          <div className="color" style={{'backgroundColor': this.state.bgHex}} />
        </div>
    );
  }
});

var AlphaInput = React.createClass({
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
      <div className="alphaInput">
        <label>Opacity %</label>
        <input type="text" value={this.state.alpha} ref="alphaNumeric" onChange={this.handleInput} />
        <input type="range" min="0" max="100" step="1" ref="alphaSlider" value={this.state.alpha} onChange={this.handleSlider} />
      </div>
    );
  }
});

var Result = React.createClass({
  render: function() {
    return (
      <div className="result">
        <label>Result</label>
        <input type="text" value={this.props.color} readonly />
        <div className="color result-color" style={{'backgroundColor': this.props.color}} />
      </div>
    );
  }
});

var TableRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>({this.props.red},{this.props.green},{this.props.blue})</td>
        <td className="color-cell" style={{'backgroundColor': this.props.hex}}></td>
        <td>{this.props.hex}</td>
        <td>{this.props.alpha}</td>
      </tr>
    );
  }
});

var ReferenceTable = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.hex !== nextProps.hex || this.props.bgHex !== nextProps.bgHex;
  },
  render: function() {
    var rows = [];
    this.props.colors.forEach(function(color) {
      rows.push(<TableRow red={color.rgb.red} blue={color.rgb.blue} green={color.rgb.green} hex={color.hex} alpha={color.alpha} />);
    });

    return (
      <table>
        <thead>
          <tr>
            <th>RGB</th>
            <th>Color</th>
            <th>Hex</th>
            <th>Opacity</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

React.render(
  <AlphaSmith />,
  document.getElementById('main')
);
