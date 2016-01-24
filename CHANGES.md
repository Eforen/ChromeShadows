# Known Bugs
* Not Sending second msg to intro state thus not moving to login state.

# Changes
* Connection State change action now works problem was in reducers
* Got intro gamestate to init
* Moved all action dispatching to the actions creation methods to allow for more complex actions.
* Moved types into there own file in actions area for sepeartion of concirns.