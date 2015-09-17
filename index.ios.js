'use strict';


var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Component,
  PickerIOS
} = React;

var PickerItemIOS = PickerIOS.items
var STORAGE_KEY = '@AsyncStorageExample:key';
var COLOR = ['blue', 'green', 'red', 'black', 'yellow'];

class Store extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedValue : COLOR[0],
      message : []
    };
  }

  _appendMessage(message){
    this.setState({message: this.state.message.concat(message)});
  }

  async _loadInitialState(){
    try{
      var value = await AsyncStorage.getItem(STORAGE_KEY);
      if (value !== null) {
        this.setState({selectedValue:value});
        this._appendMessage('Recovered selection from disk: ' + value);
      } else {
        this._appendMessage('Initialization with no selection on disk');
      }
    } catch (err) {
      this._appendMessage('AsyncStorage error: ' + err);
    }
  }

  componentDidMount() {
    this._loadInitialState().done();
    console.log('componentDidMount');
  }

  render() {
    var color = this.state.selectedValue;
    return(
      <View>
        <PickerIOS
          selectedValue={color}
          onValueChange={this._onValueChange.bind(this)}>
          {COLOR.map((value) => (
              <PickerItemIOS
                key={value}
                value={value}
                label={value}
              />
            )
          )}
        </PickerIOS>
        <Text>
          {'Selected:'}
          <Text style={{color}}>
            {this.state.selectedValue}
          </Text>
        </Text>
        <Text>{' '}</Text>
        <Text onPress={this._removeStorage.bind(this)}>
          Press here to remove from storage.
        </Text>
        <Text>{' '}</Text>
        <Text>Message:</Text>
        {this.state.message.map((m) => <Text>{m}</Text>)}
      </View>
    );
  }
  async _onValueChange(selectedValue){
    console.log('onValueChange:' + selectedValue);
    this.setState({selectedValue});
    try{
      await AsyncStorage.setItem(STORAGE_KEY, selectedValue);
      this._appendMessage('Saved selection to disk :' + selectedValue);
    } catch(err) {
      this._appendMessage('AsyncStorage error:' + err);
    }
  }
  async _removeStorage(){
    try{
      await AsyncStorage.removeItem(STORAGE_KEY);
      this._appendMessage('Selection removed from disk');
    } catch (err){
      this._appendMessage('AsyncStorage error:' + err);
    }
  }
}

AppRegistry.registerComponent('store', () => Store);
