# Known Bugs

# Changes
* Changed Connection id to incriment to avoid ID stacking
* Changed default port from telnet default to 4000 which seems to be the default for MUDs
* Fixed bug: Not transitioning to login mode
* Fixed bug: Not Sending second msg to intro state thus not moving to login state.
* Connection State change action now works problem was in reducers
* Got intro gamestate to init
* Moved all action dispatching to the actions creation methods to allow for more complex actions.
* Moved types into there own file in actions area for sepeartion of concirns.