import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import CreateRecipe from "./components/create-recipe.component";
import EditRecipe from "./components/edit-recipe.component";
import RecipesList from "./components/recipes-list.component";
import CalendarMonthView from "./components/calendar-view.component";


// import logo from "./logo.png";

class App extends Component {
	render() {
		return (
			<Router>
				<div className="container">
					<nav className="navbar navbar-expand-lg navbar-light bg-light">
						<a
							class="navbar-brand"
							href="https://codingthesmartway.com"
							target="_blank"
						>
							{/* <img
								src={logo}
								width="30"
								height="30"
								alt="CodingTheSmartWay.com"
							/> */}
						</a>
						<Link to="/" className="navbar-brand">
							Meal Planana
						</Link>
						<div className="collpase navbar-collapse">
							<ul className="navbar-nav mr-auto">
								<li className="navbar-item">
									<Link to="/" className="nav-link">
										Recipes
									</Link>
								</li>
								<li className="navbar-item">
									<Link to="/create" className="nav-link">
										Create Recipe
									</Link>
								</li>
								<li className="navbar-item">
									<Link to="/monthview" className="nav-link">
										Calendar Month View
									</Link>									
								</li>
							</ul>
						</div>
					</nav>
					<br />
					<Route path="/" exact component={RecipesList} />
					<Route path="/edit/:id" component={EditRecipe} />
					<Route path="/create" component={CreateRecipe} />
					<Route path="/monthview" component={CalendarMonthView}/>
				</div>
			</Router>
		);
	}
}

export default App;
