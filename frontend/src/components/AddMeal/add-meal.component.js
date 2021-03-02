import { GiMeal, GiBananaBunch } from 'react-icons/gi';
import React, { Component } from 'react';
import TimePicker from 'react-time-picker';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HexColorPicker } from 'react-colorful';
import Switch from 'react-switch';
import addMealStyles from './styles.AddMeal.module.css';
import Modal from '../modal/stdModal.component';

const DEFAULT_COLOR = '#007AFF';

export default class AddMeal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colorPickerVisible: false,
      repeat: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.getMeal = this.getMeal.bind(this);
    this.onChangeRecipeTitle = this.onChangeRecipeTitle.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
    this.handleSelectColor = this.handleSelectColor.bind(this);
    this.handleRepeatSwitch = this.handleRepeatSwitch.bind(this);
    this.getFontColor = this.getFontColor.bind(this);
  }

  handleSelectColor() {
    this.colorModalRef.current.open();
  }

  handleRepeatSwitch() {
    this.setState({ repeat: !this.state.repeat });
  }

  onChangeRecipeTitle(e) {
    this.setState({ mealTitle: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    // const newRecipe = {
    //   recipe_description: this.state.recipe_description,
    //   recipe_responsible: this.state.recipe_responsible,
    //   recipe_priority: this.state.recipe_priority,
    //   recipe_completed: this.state.recipe_completed,
    // };

    // axios
    //   .post('http://localhost:4000/recipes/add', newRecipe)
    //   .then((res) => console.log(res.data));

    this.setState({
      startTime: null,
      endTime: null,
      color: DEFAULT_COLOR,
    });
    this.props.onSubmit();
  }

  getMeal() {
    return (
      {
        groupID: 'test',
        title: this.state.mealTitle,
        daysOfWeek: ['1'],
        date: this.state.date,
        color: this.state.color,
        startTime: `${this.state.startTime}:00`,
        endTime: `${this.state.endTime}:00`,
      });
  }

  getFontColor(backgroundColor) {
    if (!backgroundColor) return '#FFFFFF';
    const r = parseInt(`0x${backgroundColor[1]}${backgroundColor[2]}`);
    const g = parseInt(`0x${backgroundColor[3]}${backgroundColor[4]}`);
    const b = parseInt(`0x${backgroundColor[5]}${backgroundColor[6]}`);
    console.log(r, g, b);
    return r + g + b > 400 ? '#000000' : '#FFFFFF';
  }

  toggleColorPicker() {
    this.setState({ colorPickerVisible: !this.state.colorPickerVisible });
  }

   colorModalRef = React.createRef();

   render() {
     const SWITCH_ICON = (
       <div style={{ display: 'flex', 'justify-content': 'center', paddingTop: '22%' }}>
         <GiBananaBunch color={this.state.fontColor ? this.state.fontColor : '#000000'} />
       </div>
     );
     return (
       <div style={{ marginTop: 10, fontSize: 12 }}>
         <form onSubmit={this.onSubmit}>
           <div className="form-group">
             Title
             <input
               type="text"
               className="form-control"
               value={this.state.recipe_title}
               onChange={this.onChangeRecipeTitle}
             />
           </div>
           <div className="form-group" />
           <div className={addMealStyles.flexRow}>
             <div>
               Date
               <br />
               <DatePicker
                 selected={this.state.date}
                 onChange={(date) => this.setState({ date })}
                 dateFormat="yyyy-M-d"
               />
             </div>
             <div>
               Start Time
               <br />
               <TimePicker
                 onChange={(value) => {
                   this.setState({ startTime: value });
                   console.log('TIME DATA: ', value);
                 }}
                 value={this.state.startTime}
                 format="hh:mm a"
               />
             </div>
             <div>
               End time
               <br />
               <TimePicker
                 onChange={(value) => { this.setState({ endTime: value }); }}
                 value={this.state.endTime}
               />
             </div>
           </div>
           <label style={{ 'justify-content': 'center' }}>
             Weekly
             <br />
             <Switch
               onChange={this.handleRepeatSwitch}
               checked={this.state.repeat}
               onColor={this.state.color ? this.state.color : DEFAULT_COLOR}
               onHandleColor={this.state.fontColor}
               checkedIcon={SWITCH_ICON}
             />
           </label>
           {this.state.repeat ? null : null}
           <br />
           <br />
           <button
             onClick={this.handleSelectColor}
             style={{
               backgroundColor: this.state.color
                 ? this.state.color : DEFAULT_COLOR,
               height: 20,
               width: 40,
             }}
           />
           <br />
           <Modal
             ref={this.colorModalRef}
             contentStyle={{
               width: 'fit-content',
               'block-size': 'fit-content',
               'background-color': 'transparent',
             }}
             headerDisabled
           >
             <HexColorPicker
               color={this.state.color ? this.state.color : DEFAULT_COLOR}
               onChange={(color) => {
                 this.setState({ color, fontColor: this.getFontColor(color) });
               }}
             />
           </Modal>
           <br />
           <div className="form-group">
             <input
               style={{ backgroundColor: this.state.color, color: this.state.fontColor }}
               type="submit"
               value="Add Meal"
               className="btn btn-primary"
             />
           </div>
         </form>
       </div>
     );
   }
}
AddMeal.propTypes = {
  onSubmit: PropTypes.func,
};
AddMeal.defaultProps = {
  onSubmit: () => {},
};
