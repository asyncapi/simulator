const EventEmitter = require('events').EventEmitter;
const util = require('util'),
  events = require('events');

// function CustomEmitter (opts) {
//   events.EventEmitter.call(this);
// }
// util.inherits(CustomEmitter, events.EventEmitter);
//
// CustomEmitter.prototype.emitSomething = function() {
//   this.emit('something');
// };
//
// CustomEmitter.on('something',() => {
//   console.log('lel');
// });
//
// const emitter = new CustomEmitter();
//
// emitter.on('something',() => {
//   console.log('lel');
// });
//
// emitter.emitSomething();
// function Master () {
//   function lol() {
//     console.log('log');
//   }
// }
// Master.prototype.__proto__ = EventEmitter.prototype;
//
// const masterInstance = new Master();
//
// masterInstance.on('an_event', () => {
//   console.log('an event has happened');
// });
//
// // trigger the event
// masterInstance.emit('an_event');
//
// masterInstance.lol();

function MyEmitter (name) {
  this.name = name;
  const lol = 'lol';
  this.getLol = () => {
    return lol;
  };
  //      events.EventEmitter.call(this);
  this.emitEvent = function() {
    this.emit('Event1');
  };
}
//MyEmitter.prototype.__proto__ = events.EventEmitter.prototype;
MyEmitter.prototype         = events.EventEmitter.prototype;

function foo() {
  console.log(`callback: ${  this.name}`);
}

const obj = new MyEmitter('MyEmitter');
obj.on('Event1', foo);
obj.emitEvent();
console.log(obj.getLol());
