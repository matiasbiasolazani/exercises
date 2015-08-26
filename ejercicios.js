//------------------------------------ Vehicle Constructor --------------------------------------
var VehicleClass = function (speed, propultionUnits) {
	this.speed = speed;
	this.propultionUnits = propultionUnits;

	this.accelerate = function () {
		for (var i = 0; i < this.propultionUnits.length; i++) {
			this.speed += this.propultionUnits[i].getAcceleration();
		}
	}
}

var PropultionUnit = function () {
	this.getAcceleration = function () {};
}

//------------------------------------ WheelUnit --------------------------------------

var WheelUnit = function (radius){
	this.radius = radius;
	this.getAcceleration = function () { 
		return parseInt(2 * Math.PI * this.radius); 
	}
}

WheelUnit.prototype = new PropultionUnit();


//------------------------------------ PropellingNozzleUnit --------------------------------------
var AfterPressburnerSwitch = {
	"act": 0,
	"des": 1
};

var PropellingNozzleUnit = function (power, afterpressburnerSwitch) {
	this.power = power;
	this.afterpressburnerSwitch = afterpressburnerSwitch;

	this.getAcceleration = function () { 
		if (this.afterpressburnerSwitch === AfterPressburnerSwitch.act) {
			return 2 * this.power;
		} else {
			return this.power;
		} 
	}
}

PropellingNozzleUnit.prototype = new PropultionUnit();

//------------------------------------ Propeller Unit --------------------------------------
var GetSpinDirection = {
	"clockwise": 0,
	"counter": 1
};

var PropellerUnit = function (fins, spinDirection) {
	this.fins = fins;
	this.spinDirection = spinDirection;

	this.getAcceleration = function (fins, spinDirection) {
		if (this.spinDirection === GetSpinDirection.clockwise) {
			return this.fins;
		} else {
			return this.fins*(-1);
		}
	}
}

PropellerUnit.prototype = new PropultionUnit();

//------------------------------------ LandVehicleClass --------------------------------------
var LandVehicleClass = function (speed, wheels) {
	VehicleClass.call(this, speed, wheels);
}
LandVehicleClass.prototype = new VehicleClass(); 

//------------------------------------ AirVehicleClass --------------------------------------
var AirVehicleClass = function (speed, propellingNozzle) {

	this.switchAfterburners= function (afterpressburnerSwitch) {
        for (var i = 0, len = this.propultionUnits.length; i < len; i++) {
            if (this.propultionUnits[i] instanceof PropellingNozzleUnit) {
                this.propultionUnits[i].afterpressburnerSwitch = afterpressburnerSwitch;
            }
        }
	}

	VehicleClass.call(this, speed, propellingNozzle);
}
AirVehicleClass.prototype = new VehicleClass();

//------------------------------------ WaterVehicleClass --------------------------------------
var WaterVehicleClass = function (speed, propellers) {
	this.propellers = propellers;

	this.modifiedSpinDirection = function (spinDirection) {
        for (var i = 0; i < this.propultionUnits.length; i++) {
            if (this.propultionUnits[i] instanceof PropellerUnit) {
                this.propultionUnits[i].spinDirection = spinDirection;
            }
        }
	}
	VehicleClass.call(this, speed, propellers);
}
WaterVehicleClass.prototype = new VehicleClass();


//------------------------------------ AmphibiousVehicleClass --------------------------------------
var AmphibiousMode = {
    "land": 0,
    "water": 1
};

var AmphibiousVehicleClass = function (speed, wheels, propellers,  mode) {
	var propultionUnits = [];

	for (var i = 0; i < propellers.length; i++) {
		propultionUnits.push(propellers[i]);
	}

	for (var j = 0; j < wheels.length; j++) {
		propultionUnits.push(wheels[i]);
	}

	VehicleClass.call(this, speed, propultionUnits);
	

	this.mode = mode;
	this.accelerate = function() {
		if (this.mode === AmphibiousMode.land) {
			for (var i = 0; i < this.propultionUnits.length; i++) {
				if (this.propultionUnits[i] instanceof WheelUnit) {
					this.speed += this.propultionUnits[i].getAcceleration();
				}
			}
		} else if (this.mode === AmphibiousMode.water) {
			for (var i = 0; i < this.propultionUnits.length; i++) {
				if (this.propultionUnits[i] instanceof WheelUnit) {
					this.speed += this.propultionUnits[i].getAcceleration();
				}
			}
		} 
	}

	this.switchMode= function(mode) {
		this.mode = mode;
	}

}

AmphibiousVehicleClass.prototype = {
	VehicleClass: new VehicleClass(), 
	water: new WaterVehicleClass(), 
	land: new LandVehicleClass()
};

//------------------------------------- Propultion Units ---------------------------------------------------
var wheels = [
	new WheelUnit(20), new WheelUnit(30), new WheelUnit(20), new WheelUnit(30)
];

var propellingNozzle = [
	new PropellingNozzleUnit(270, AfterPressburnerSwitch.act)
];


var waterVehicleClassPropellers = [
    new PropellerUnit(10, GetSpinDirection.clockwise),
    new PropellerUnit(10, GetSpinDirection.clockwise),
    new PropellerUnit(10, GetSpinDirection.clockwise)
];


var amphibiousVehicleClassPropellers = [
    new PropellerUnit(7, GetSpinDirection.clockwise),
    new PropellerUnit(7, GetSpinDirection.clockwise)
];

//---------------------- LAND VEHICLE ----------------------
var landVehicleClass = new LandVehicleClass(120, wheels);
console.log("Vehiculo de tierra, velocidad inicial: " + landVehicleClass.speed);
landVehicleClass.accelerate();
console.log("Vehiculo de tierra despues de acelerar: " + landVehicleClass.speed);

//---------------------- AIR VEHICLE ----------------------
var airVehicleClass = new AirVehicleClass(600, propellingNozzle);
console.log("Vehiculo de Aire, velocidad inicial: " + airVehicleClass.speed);

airVehicleClass.accelerate();
console.log("Vehiculo de aire, velocidad despues de la aceleracion con el interruptor de potencia desactivado: " + airVehicleClass.speed);

airVehicleClass.switchAfterburners(AfterPressburnerSwitch.des);
airVehicleClass.accelerate();
console.log("Vehiculo de aire, velocidad despues de la aceleracion con el interruptor de potencia activado: " + airVehicleClass.speed);

//---------------------- WATER VEHICLE ----------------------
var waterVehicleClass = new WaterVehicleClass(70, waterVehicleClassPropellers);
console.log("Vehiculo de agua, velocidad inicial: " + waterVehicleClass.speed);
waterVehicleClass.accelerate();
console.log("Vehiculo de agua, velocidad despues de la aceleracion con la rotacion de helice clockwise: " + waterVehicleClass.speed);

waterVehicleClass.modifiedSpinDirection(GetSpinDirection.counter);
waterVehicleClass.accelerate();
console.log("Vehiculo de agua, velocidad despues de la aceleracion con la rotacion de helice counter: " + waterVehicleClass.speed);

//---------------------- AMPHIBIOUS VEHICLE ----------------------

var amphibiousVehicleClass = new AmphibiousVehicleClass(40, amphibiousVehicleClassPropellers, wheels, AmphibiousMode.land);
console.log("Vehiculo  anfibio velocidad inicial: " + amphibiousVehicleClass.speed);
amphibiousVehicleClass.accelerate();
console.log("Vehiculo anfibio velocidad despues de acelerar en la tierra: " + amphibiousVehicleClass.speed);
amphibiousVehicleClass.switchMode(AmphibiousMode.water);
amphibiousVehicleClass.accelerate();
console.log("Vehiculo anfibio, velocidad despues de acelerar en agua con la helice clockwise: " + amphibiousVehicleClass.speed);

