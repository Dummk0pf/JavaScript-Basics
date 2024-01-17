'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App{
    #map;
    #mapEvent;
    #workouts;

    constructor(){
        this.#workouts = [];
        this._getPosition();
        this._getLocalStorage();
        form.addEventListener("submit", this._newWorkout.bind(this));
        inputType.addEventListener("change", this._toggleElevationField);
        containerWorkouts.addEventListener("click", this._moveToWorkout.bind(this));
    }

    _getPosition(){
        if(navigator.geolocation !== null){
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){
                    alert("Unable to get Location information");
                }
            );
        }
    }

    _loadMap(position){        
        this.#map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13); // 13 is the zoom level

        const {latitude} = position.coords;
        const {longitude} = position.coords;
        
        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        this.#map.on('click', this._showForm.bind(this));

        this.#workouts.forEach(work => {
            this._renderWorkoutMap(work);
        })
    }
    
    _showForm(mapE){
        this.#mapEvent = mapE;
        form.classList.remove("hidden");
        inputDistance.focus();
    }

    _toggleElevationField(){
        if(inputType.value === "running"){
            inputCadence.closest(".form__row").classList.remove("form__row--hidden");
            inputElevation.closest(".form__row").classList.add("form__row--hidden");
        }
        if(inputType.value === 'cycling'){
            inputCadence.closest(".form__row").classList.add("form__row--hidden");
            inputElevation.closest(".form__row").classList.remove("form__row--hidden");
        }
    }

    _newWorkout(event){
        event.preventDefault();

        let type = inputType.value;

        if(type !== "running" && type !== "cycling"){
            alert("Invalid type in input fields");
            this._clearInputFields();
            return;
        }

        let workout;
        const {lat, lng} = this.#mapEvent.latlng;
        const coords = [lat, lng];

        if(inputType.value === "running"){
            let distance = Number(inputDistance.value);
            let duration = Number(inputDuration.value);
            let cadence = Number(inputCadence.value);

            if(Number.isNaN(distance) || Number.isNaN(cadence) || Number.isNaN(duration) || distance <= 0 || cadence <= 0 || duration <= 0){
                alert("Invalid data in input fields");
                this._clearInputFields();
                return;
            }

            workout = new Running(coords, distance, duration, cadence);
        }
        
        if(inputType.value === "cycling"){
            let distance = Number(inputDistance.value);
            let duration = Number(inputDuration.value);
            let elevation = Number(inputElevation.value);

            if(Number.isNaN(distance) || Number.isNaN(elevation) || Number.isNaN(duration) || distance <= 0 || duration <= 0){
                alert("Invalid data in input fields");
                this._clearInputFields();
                return;
            }

            workout = new Cycling(coords, distance, duration, elevation);
        }

        this.#workouts.push(workout);

        // Clear input fields
        this._clearInputFields();

        this._renderWorkoutMap(workout);
        
        this._renderWorkout(workout);
        
        this._hideForm();

        // Set local storage

        this._setLocalStorage();
    }
    
    _renderWorkout(workout){

        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === "running" ? "🏃‍♀️" : "🚴‍♂️"}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⌚</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div> 
        `;

        if(workout.type === "running"){
            html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${Math.round(workout.pace)}</span>
                <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
            </div>
            `
        }

        if(workout.type === "cycling"){
            html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${Math.round(workout.speed)}</span>
                <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.elevationGain}</span>
                <span class="workout__unit">m</span>
            </div>
            `
        }

        form.insertAdjacentHTML("afterend", html);
    }

    _renderWorkoutMap(workout){
        L.marker(workout.coords).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`
        })).setPopupContent((workout.type === "running" ? "🏃‍♀️ " : "🚴‍♂️ ") + workout.description).openPopup();

    }

    _hideForm(){
        form.style.display = "none";
        setTimeout(() => {
            form.style.display = "grid";
        }, 1000);
        form.classList.add("hidden");
    }
    
    _clearInputFields(){
        // Clear input fields
        inputCadence.value = '';
        inputDistance.value = '';
        inputDuration.value = '';
        inputElevation.value = '';
        inputType.value = '';
    }

    _moveToWorkout(event){
        const workoutElement = event.target.closest(".workout");

        if(workoutElement === null)
        return;

        const id = workoutElement.dataset.id;

        const workoutObj = this.#workouts.find(work => work.id === id);
        
        if(workoutObj === null) return;

        this.#map.setView(workoutObj.coords, 13, {
            animate: true,
            pan: {
                duration: 1
            }
        }); 

        workoutObj.click();
    }

    _setLocalStorage(){
        localStorage.setItem("workout", JSON.stringify(this.#workouts));
    }

    _getLocalStorage(){
        const data = JSON.parse(localStorage.getItem("workout"));

        if(!data) return;

        Array.from(data).forEach(element =>{
            if(element.type === "running"){
                element.__proto__ = Running.prototype;
            }
            
            if(element.type === "cycling"){
                element.__proto__ = Cycling.prototype;
            }
            this.#workouts.push(element)
        });

        (this.#workouts).forEach(work => {
            this._renderWorkout(work)
        }
        );
    }

    reset(){
        localStorage.removeItem("workout");
        window.location.reload();
    }
}

class Workout{
    id;
    coords;
    distance;
    duration;
    date;
    description;
    type;
    clicks;

    constructor(coords, distance, duration){
        this.id = (Date.now() + "").slice(-10);
        this.date = new Date();
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
        this.description = "";
        this.clicks = 0;
    }

    _setDescription(){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }

    click(){
        this.clicks++;
    }
}


class Running extends Workout{

    cadence;
    pace;

    constructor(coords, distance, duration, cadence){
        super(coords, distance, duration);
        this.type = "running";
        this.cadence = cadence;
        this._calcPace();
        this._setDescription();
    }
    
    _calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout{
    
    elevationGain;
    speed;

    constructor(coords, distance, duration, elevationGain){
        super(coords, distance, duration);
        this.type = "cycling";
        this.elevationGain = elevationGain;
        this._calcSpeed();
        this._setDescription();
    }
    
    _calcSpeed(){
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }

}
const start = new App();