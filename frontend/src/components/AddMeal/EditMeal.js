import { GiBananaBunch } from 'react-icons/gi';
import React, { Component } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HexColorPicker } from 'react-colorful';
import Switch from 'react-switch';
import NumericInput from 'react-numeric-input';
import { connect } from 'react-redux';
import addMealStyles from './styles.AddMeal.module.css';
import Modal from '../modal/stdModal.component';
import { updateMeals } from '../../actions/session';

const DEFAULT_COLOR = '#007AFF';

const getFontColor = (backgroundColor) => {
  if (!backgroundColor) return '#FFFFFF';
  const r = parseInt(`0x${backgroundColor[1]}${backgroundColor[2]}`, 16);
  const g = parseInt(`0x${backgroundColor[3]}${backgroundColor[4]}`, 16);
  const b = parseInt(`0x${backgroundColor[5]}${backgroundColor[6]}`, 16);
  return r + g + b > 400 ? '#000000' : '#FFFFFF';
};

const mapStateToProps = (state) => ({
  errors: state.session.errors,
  meals: state.session.meals,
});

class EditMeal extends Component {
  constructor(props) {
    super(props);

    // Get list of selected recipes to list below title
    let recipeTitles = '';
    this.recipeIDs = [];
    let maxReached = false;

    this.props.recipes.forEach((recipe) => {
      this.recipeIDs.push(recipe._id);
      if (recipe.title) {
        if (recipeTitles.length < 140) recipeTitles += ` ${recipe.title},`;
        else if (!maxReached) {
          recipeTitles += ' ...';
          maxReached = true;
        }
      }
    });

    this.state = {
      colorPickerVisible: false,
      repeat: false,
      weekDays: [],
      freq: 'weekly',
      interval: 1,
      duration: 60,
      timeUnits: 'Minutes',
      selectedRecipeTitles: recipeTitles,
      color: DEFAULT_COLOR,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.getMeal = this.getMeal.bind(this);
    this.onChangeRecipeTitle = this.onChangeRecipeTitle.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
    this.handleSelectColor = this.handleSelectColor.bind(this);
    this.handleRepeatSwitch = this.handleRepeatSwitch.bind(this);
    this.editMeal = this.editMeal.bind(this);
  }

  handleSelectColor() {
    this.colorModalRef.current.open();
  }

  handleRepeatSwitch() {
    this.setState((state) => ({
      colorPickerVisible: state.colorPickerVisible,
      repeat: !state.repeat,
      weekDays: state.weekDays,
      freq: state.freq,
      interval: state.interval,
      duration: state.duration,
      timeUnits: state.timeUnits,
    }));
  }

  onChangeRecipeTitle(e) {
    this.setState({ mealTitle: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    // TODO RESET ALL STATE

    this.editMeal(this.getMeal());
    this.setState({
      startTime: null,
      color: DEFAULT_COLOR,
    });
  }

  getMeal() {
    const startD = new Date(this.state.startDate);
    const endD = new Date(this.state.startDate);
    this.state.timeUnits === 'Hours'
      ? endD.setHours(startD.getHours() + this.state.duration)
      : endD.setMinutes(startD.getMinutes() + this.state.duration);

    return (
      {
        title: this.state.mealTitle,
        // recipe: mongoose.Types.ObjectId(this.recipeIDs[0]),
        recipes: this.recipeIDs,
        start_date: startD,
        end_date: endD,
        days: this.state.weekDays,
        duration: parseInt(this.state.duration, 10),
        color: this.state.color,
        freqType: this.state.freq.toUpperCase(),
        interval: parseInt(this.state.interval, 10),
      });
  }

  getDaySelectorColor(day) {
    return {
      color: this.state.weekDays.includes(day) ? this.state.fontColor : '#000000',
      backgroundColor: this.state.weekDays.includes(day) ? this.state.color : '#FFFFFF',
    };
  }

  editMeal(meal) {
    let newMeals = this.props.meals;
    newMeals = newMeals.concat(meal);
    this.props.updateMeals(newMeals);
  }

  toggleColorPicker() {
    this.setState((state) => ({
      colorPickerVisible: !state.colorPickerVisible,
      repeat: state.repeat,
      weekDays: state.weekDays,
      freq: state.freq,
      interval: state.interval,
      duration: state.duration,
      timeUnits: state.timeUnits,
    }));
  }

   colorModalRef = React.createRef();

   render() {
     const SWITCH_ICON = (
       <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '22%' }}>
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
           <div>
             Selected Recipes:
             <i>
               {' '}
               {this.state.selectedRecipeTitles}
             </i>
           </div>
           <div className={addMealStyles.flexRow}>
             <label style={{ justifyContent: 'center', marginRight: '5%' }}>
               Repeat
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
                 <label style={{ justifyContent: 'center', marginRight: '5%' }}>
                   Interval
                   <br />
                   <NumericInput
                     style={{
                       input: {
                         height: 25, width: 60,
                       },
                     }}
                     onChange={(interval) => { this.setState({ interval }); }}
                     value={this.state.interval}
                     step={1}
                     min={0}
                     max={2000}
                   />
                 </label>
               )
               : null}
             {this.state.repeat
               ? (
                 <Dropdown style={{ display: 'flex', alignItems: 'center' }}>
                   <Dropdown.Toggle
                     style={{
                       backgroundColor: '#FFFFFF',
                       color: '#000000',
                       width: 90,
                       height: 37,
                     }}
                     id="dropdown-basic"
                   >
                     {this.state.freq}
                   </Dropdown.Toggle>

                   <Dropdown.Menu>
                     <Dropdown.Item onClick={() => this.setState({ freq: 'Daily' })} href="#/daily">Daily</Dropdown.Item>
                     <Dropdown.Item onClick={() => this.setState({ freq: 'Weekly' })} href="#/weekly">Weekly</Dropdown.Item>
                     <Dropdown.Item onClick={() => this.setState({ freq: 'Monthly' })} href="#/monthly">Monthly</Dropdown.Item>
                     <Dropdown.Item onClick={() => this.setState({ freq: 'Yearly' })} href="#/yearly">Yearly</Dropdown.Item>
                   </Dropdown.Menu>
                 </Dropdown>

               )
               : null}
           </div>
           {this.state.repeat && this.state.freq === 'Weekly'
             ? (
               <div>
                 <ToggleButtonGroup
                   type="checkbox"
                   value={this.state.weekDays}
                   onChange={(weekDays) => this.setState({ weekDays })}
                 >
                   <ToggleButton style={this.getDaySelectorColor(0)} variant="outline-primary" value={0}>Sun</ToggleButton>
                   <ToggleButton style={this.getDaySelectorColor(1)} variant="outline-primary" value={1}>Mon</ToggleButton>
                   <ToggleButton style={this.getDaySelectorColor(2)} variant="outline-primary" value={2}>Tue</ToggleButton>
                   <ToggleButton style={this.getDaySelectorColor(3)} variant="outline-primary" value={3}>Wed</ToggleButton>
                   <ToggleButton style={this.getDaySelectorColor(4)} variant="outline-primary" value={4}>Thu</ToggleButton>
                   <ToggleButton style={this.getDaySelectorColor(5)} variant="outline-primary" value={5}>Fri</ToggleButton>
                   <ToggleButton style={this.getDaySelectorColor(6)} variant="outline-primary" value={6}>Sat</ToggleButton>
                 </ToggleButtonGroup>
               </div>
             )
             : null}
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
                 selectsStart
                 startDate={this.state.startDate}
                 endDate={this.state.endDate}
               />
             </div>
             <label style={{ justifyContent: 'center', marginLeft: '5%', marginRight: '5%' }}>
               Duration
               <br />
               <NumericInput
                 style={{
                   input: {
                     height: 25, width: 60,
                   },
                 }}
                 onChange={(duration) => { this.setState({ duration }); }}
                 value={this.state.duration}
                 step={1}
                 min={0}
                 max={2000}
               />
             </label>
             <Dropdown style={{ display: 'flex', alignItems: 'center' }}>
               <Dropdown.Toggle
                 style={{
                   backgroundColor: '#FFFFFF',
                   color: '#000000',
                   width: 90,
                   height: 37,
                 }}
                 id="dropdown-basic"
               >
                 {this.state.timeUnits}
               </Dropdown.Toggle>

               <Dropdown.Menu>
                 <Dropdown.Item onClick={() => this.setState({ timeUnits: 'Minutes' })} href="#/minutes">Minutes</Dropdown.Item>
                 <Dropdown.Item onClick={() => this.setState({ timeUnits: 'Hours' })} href="#/hours">Hours</Dropdown.Item>
               </Dropdown.Menu>
             </Dropdown>
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
                 this.setState({ color, fontColor: getFontColor(color) });
               }}
             />
           </Modal>
           <br />
           <div className="form-group">
             <input
               style={{ backgroundColor: this.state.color, color: this.state.fontColor }}
               type="submit"
               value={this.props.buttonTitle}
               className="btn btn-primary"
             />
           </div>
         </form>
       </div>
     );
   }
}
EditMeal.propTypes = {
  onSubmit: PropTypes.func,
};
EditMeal.defaultProps = {
  onSubmit: () => {},
};

export default connect(
  mapStateToProps,
  { updateMeals },
)(EditMeal);
