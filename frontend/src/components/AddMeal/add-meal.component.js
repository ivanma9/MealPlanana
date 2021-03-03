import { GiMeal, GiBananaBunch } from 'react-icons/gi';
import React, { Component } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
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
      value: [],
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.getMeal = this.getMeal.bind(this);
    this.onChangeRecipeTitle = this.onChangeRecipeTitle.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
    this.handleSelectColor = this.handleSelectColor.bind(this);
    this.handleRepeatSwitch = this.handleRepeatSwitch.bind(this);
    this.getFontColor = this.getFontColor.bind(this);
    this.getValidDays = this.getValidDays.bind(this);
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
        title: this.state.mealTitle,
        daysOfWeek: this.state.value,
        date: this.state.date,
        color: this.state.color,
        start_date: this.state.startTime,
        end_date: this.state.endTime,
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

  getDaySelectorColor(day) {
    return {
      color: this.state.value.includes(day) ? this.state.fontColor : 'black',
      backgroundColor: this.state.value.includes(day) ? this.state.color : 'white',
    };
  }

  toggleColorPicker() {
    this.setState({ colorPickerVisible: !this.state.colorPickerVisible });
  }

  getValidDays(date) {
    const dDate = new Date(date);
    const day = dDate.getDay(date);
    return this.state.value.includes(day);
  }

   colorModalRef = React.createRef();

   render() {
     const SWITCH_ICON = (
       <div style={{ display: 'flex', 'justify-content': 'center', paddingTop: '22%' }}>
         <GiBananaBunch color={this.state.fontColor ? this.state.fontColor : '#000000'} />
       </div>
     );
     return (
       <div style={{ margin: '1%', fontSize: 12 }}>
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

           <label style={{ 'justify-content': 'center', marginRight: '5%' }}>
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
           {this.state.repeat
             ? (
               <ToggleButtonGroup
                 type="checkbox"
                 value={this.state.value}
                 onChange={(value) => this.setState({ value })}
               >
                 <ToggleButton style={this.getDaySelectorColor(0)} variant="outline-primary" value={0}>Sun</ToggleButton>
                 <ToggleButton style={this.getDaySelectorColor(1)} variant="outline-primary" value={1}>Mon</ToggleButton>
                 <ToggleButton style={this.getDaySelectorColor(2)} variant="outline-primary" value={2}>Tue</ToggleButton>
                 <ToggleButton style={this.getDaySelectorColor(3)} variant="outline-primary" value={3}>Wed</ToggleButton>
                 <ToggleButton style={this.getDaySelectorColor(4)} variant="outline-primary" value={4}>Thu</ToggleButton>
                 <ToggleButton style={this.getDaySelectorColor(5)} variant="outline-primary" value={5}>Fri</ToggleButton>
                 <ToggleButton style={this.getDaySelectorColor(6)} variant="outline-primary" value={6}>Sat</ToggleButton>
               </ToggleButtonGroup>
             )
             : null}

           <br />
           <div className={addMealStyles.flexRow}>
             <div>
               Start Date
               <br />
               <DatePicker
                 selected={this.state.startDate}
                 onChange={(startDate) => this.setState({ startDate })}
                 timeInputLabel="Start Time:"
                 dateFormat="MM/dd/yyyy h:mm aa"
                 showTimeInput
                 filterDate={this.state.repeat ? this.getValidDays : () => true}
                 selectsStart
                 startDate={this.state.startDate}
                 endDate={this.state.endDate}
               />
             </div>
             <div style={{ marginLeft: '15%' }}>
               End Date
               <br />
               <DatePicker
                 selected={this.state.endDate}
                 onChange={(endDate) => this.setState({ endDate })}
                 timeInputLabel="End Time:"
                 dateFormat="MM/dd/yyyy h:mm aa"
                 filterDate={this.state.repeat ? this.getValidDays : () => true}
                 selectsEnd
                 startDate={this.state.startDate}
                 endDate={this.state.endDate}
                 minDate={this.state.startDate}
                 showTimeInput
               />
             </div>

           </div>
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
