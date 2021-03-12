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
import { Container } from 'react-bootstrap'
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
  recipes: state.recipes.items,
});

const convertWeekdays = (arr) => {
  const convertedArr = [false, false, false, false, false, false, false];

  arr.forEach((num) => {
    convertedArr[num] = true;
  });
  return convertedArr;
};
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
      weekdays: [],
      freq: 'Weekly',
      interval: 1,
      duration: 60,
      timeUnits: 'Minutes',
      selectedRecipeTitles: recipeTitles,
      color: DEFAULT_COLOR,
      addError: false,
      startDate: new Date(),
    };

    this.onSubmitValid = this.onSubmitValid.bind(this);
    this.onSubmitInvalid = this.onSubmitInvalid.bind(this);
    this.getMeal = this.getMeal.bind(this);
    this.onChangeRecipeTitle = this.onChangeRecipeTitle.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
    this.handleSelectColor = this.handleSelectColor.bind(this);
    this.handleRepeatSwitch = this.handleRepeatSwitch.bind(this);
    this.addMeal = this.addMeal.bind(this);
    this.isValidEntry = this.isValidEntry.bind(this);
  }

  handleSelectColor() {
    this.colorModalRef.current.open();
  }

  handleRepeatSwitch() {
    this.setState((state) => ({
      colorPickerVisible: state.colorPickerVisible,
      repeat: !state.repeat,
      weekdays: state.weekdays,
      freq: state.freq,
      interval: state.interval,
      duration: state.duration,
      timeUnits: state.timeUnits,
      mealTitle: state.mealTitle,
      startDate: new Date(),
    }));
  }

  onChangeRecipeTitle(e) {
    this.setState({ mealTitle: e.target.value });
  }

  isValidEntry() {
    return (this.state.mealTitle && this.state.mealTitle.length > 0)
    && this.state.startDate
    && (this.state.repeatUntil || !this.state.repeat)
    && (this.state.weekdays || !this.state.repeat)
    && this.state.duration
    && this.state.color
    && this.state.freq
    && this.state.interval;
  }

  onSubmitValid(e) {
    e.preventDefault();
    this.addMeal(this.getMeal());
    this.props.onSubmit();
  }

  onSubmitInvalid(e) {
    e.preventDefault();
    this.setState({ addError: true });
    setTimeout(() => { this.setState({ addError: false }); }, 2500);
  }

  getMeal() {
    const startD = new Date(this.state.startDate);
    const endD = this.state.repeat ? this.state.repeatUntil : new Date(this.state.startDate);
    this.state.timeUnits === 'Hours'
      ? endD.setHours(startD.getHours() + this.state.duration)
      : endD.setMinutes(startD.getMinutes() + this.state.duration);
    const noWeeklyArr = [false, false, false, false, false, false, false];
    noWeeklyArr[startD.getDay()] = true;
    return (
      this.state.repeat
        ? {
          title: this.state.mealTitle,
          recipes: this.recipeIDs,
          start_date: startD,
          end_date: endD,
          days: this.state.freq === 'Weekly' ? convertWeekdays(this.state.weekdays) : noWeeklyArr,
          duration: parseInt(this.state.duration, 10),
          color: this.state.color,
          freqType: this.state.freq.toUpperCase(),
          interval: parseInt(this.state.interval, 10),
        }
        : {
          title: this.state.mealTitle,
          recipes: this.recipeIDs,
          start_date: startD,
          end_date: endD,
          days: noWeeklyArr,
          duration: parseInt(this.state.duration, 10),
          color: this.state.color,
          freqType: 'daily',
          interval: 1,
        }

    );
  }

  getDaySelectorColor(day) {
    return {
      color: this.state.weekdays.includes(day) ? this.state.fontColor : '#000000',
      backgroundColor: this.state.weekdays.includes(day) ? this.state.color : '#FFFFFF',
    };
  }

  addMeal(meal) {
    let newMeals = this.props.meals;
    newMeals = newMeals.concat(meal);
    this.props.updateMeals(newMeals);
  }

  toggleColorPicker() {
    this.setState((state) => ({
      colorPickerVisible: !state.colorPickerVisible,
      repeat: state.repeat,
      weekdays: state.weekdays,
      freq: state.freq,
      interval: state.interval,
      duration: state.duration,
      timeUnits: state.timeUnits,
    }));
  }

  editMeal(meal) {
    let newMeals = this.props.meals;
    newMeals = newMeals.concat(meal);
    this.props.updateMeals(newMeals);
  }
  
  viewRecipeList(recipeList){
    let i = 0;
    return recipeList.map((recipe) => (
      <div key={recipe}>
        <h3>{recipe.title}</h3>
        <p>
          {console.log(recipe.title)}
          {ReactHtmlParser(recipe.description)}
          {' '}
          
        </p>
      </div>
    ));
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
         <Container>
         <form onSubmit={this.isValidEntry() ? this.onSubmitValid : this.onSubmitInvalid}>
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
                   value={this.state.weekdays}
                   onChange={(weekdays) => this.setState({ weekdays })}
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
           {this.state.repeat ? (
             <div>
               Repeat Until
               <br />
               <DatePicker
                 selected={this.state.repeatUntil}
                 onChange={(repeatUntil) => this.setState({ repeatUntil })}
                 timeInputLabel="Start Time:"
                 dateFormat="MM/dd/yyyy h:mm aa"
                 showTimeInput
                 minDate={this.state.startDate}
               />
             </div>
           ) : null}
           <br />
           <button
             onClick={this.handleSelectColor}
             type="button"
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
               height: 'fit-content',
               backgroundColor: 'transparent',
               overflow: 'visible',
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
           <div className="form-group" style={{ display: 'flex', flexDirection: 'row' }}>
             <input
               style={{ backgroundColor: this.state.addError ? 'red' : this.state.color, color: this.state.fontColor }}
               type="submit"
               value={this.props.buttonTitle}
               className="btn btn-primary"
             />
             {this.state.addError ? (
               <div style={{
                 marginLeft: '4%', color: 'red', fontWeight: 20, fontSize: 18, textAlign: 'center',
               }}
               >
                 {' '}
                 Error: Please fill out all fields
               </div>
             ) : null}
           </div>
         </form>
         </Container>

         <Container>
            {this.viewRecipeList(this.props.recipes)}
         </Container>
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
