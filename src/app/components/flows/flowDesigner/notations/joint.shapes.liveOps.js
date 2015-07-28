(function() {
  'use strict';

  joint.shapes.liveOps = joint.shapes.liveOps || {};
  joint.shapes.liveOps.icons = {
    none: '',
    noneThrowing: '',
    message: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA1MTIiIGhlaWdodD0iNTEycHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik00NzkuOTk4LDY0SDMyQzE0LjMyOSw2NCwwLDc4LjMxMiwwLDk2djMyMGMwLDE3LjY4OCwxNC4zMjksMzIsMzIsMzJoNDQ3Ljk5OEM0OTcuNjcxLDQ0OCw1MTIsNDMzLjY4OCw1MTIsNDE2Vjk2ICBDNTEyLDc4LjMxMiw0OTcuNjcxLDY0LDQ3OS45OTgsNjR6IE00MTYsMTI4TDI1NiwyNTZMOTYsMTI4SDQxNnogTTQ0OCwzODRINjRWMTYwbDE5MiwxNjBsMTkyLTE2MFYzODR6Ii8+PC9zdmc+',
    plus: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIyLjUsMTRIMTR2OC41YzAsMC4yNzYtMC4yMjQsMC41LTAuNSwwLjVoLTRDOS4yMjQsMjMsOSwyMi43NzYsOSwyMi41VjE0SDAuNSAgQzAuMjI0LDE0LDAsMTMuNzc2LDAsMTMuNXYtNEMwLDkuMjI0LDAuMjI0LDksMC41LDlIOVYwLjVDOSwwLjIyNCw5LjIyNCwwLDkuNSwwaDRDMTMuNzc2LDAsMTQsMC4yMjQsMTQsMC41VjloOC41ICBDMjIuNzc2LDksMjMsOS4yMjQsMjMsOS41djRDMjMsMTMuNzc2LDIyLjc3NiwxNCwyMi41LDE0eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+',
    cross: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0yMi4yNDUsNC4wMTVjMC4zMTMsMC4zMTMsMC4zMTMsMC44MjYsMCwxLjEzOWwtNi4yNzYsNi4yN2MtMC4zMTMsMC4zMTItMC4zMTMsMC44MjYsMCwxLjE0bDYuMjczLDYuMjcyICBjMC4zMTMsMC4zMTMsMC4zMTMsMC44MjYsMCwxLjE0bC0yLjI4NSwyLjI3N2MtMC4zMTQsMC4zMTItMC44MjgsMC4zMTItMS4xNDIsMGwtNi4yNzEtNi4yNzFjLTAuMzEzLTAuMzEzLTAuODI4LTAuMzEzLTEuMTQxLDAgIGwtNi4yNzYsNi4yNjdjLTAuMzEzLDAuMzEzLTAuODI4LDAuMzEzLTEuMTQxLDBsLTIuMjgyLTIuMjhjLTAuMzEzLTAuMzEzLTAuMzEzLTAuODI2LDAtMS4xNGw2LjI3OC02LjI2OSAgYzAuMzEzLTAuMzEyLDAuMzEzLTAuODI2LDAtMS4xNEwxLjcwOSw1LjE0N2MtMC4zMTQtMC4zMTMtMC4zMTQtMC44MjcsMC0xLjE0bDIuMjg0LTIuMjc4QzQuMzA4LDEuNDE3LDQuODIxLDEuNDE3LDUuMTM1LDEuNzMgIEwxMS40MDUsOGMwLjMxNCwwLjMxNCwwLjgyOCwwLjMxNCwxLjE0MSwwLjAwMWw2LjI3Ni02LjI2N2MwLjMxMi0wLjMxMiwwLjgyNi0wLjMxMiwxLjE0MSwwTDIyLjI0NSw0LjAxNXoiLz48L3N2Zz4=',
    user: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIyLDIwLjk5OGgtMWMwLDAtMSwwLTEtMVYxNy41YzAtMC4yNzctMC4yMjQtMC41LTAuNS0wLjVTMTksMTcuMjIzLDE5LDE3LjUgIGwtMC4wMDgsNC4yOTVjMCwwLjYwOS0yLjAxLDIuMjA1LTYuNDkyLDIuMjA1cy02LjQ5Mi0xLjU5Ni02LjQ5Mi0yLjIwNUw2LDE3LjVDNiwxNy4yMjMsNS43NzYsMTcsNS41LDE3UzUsMTcuMjIzLDUsMTcuNXYyLjQ5OCAgYzAsMS0xLDEtMSwxSDNjMCwwLTEsMC0xLTFWMTUuNzVjMC0yLjkyMiwyLjg5Mi01LjQwMSw2LjkzLTYuMzQxYzAsMCwxLjIzNCwxLjEwNywzLjU3LDEuMTA3czMuNTctMS4xMDcsMy41Ny0xLjEwNyAgYzQuMDM4LDAuOTQsNi45MywzLjQxOSw2LjkzLDYuMzQxdjQuMjQ4QzIzLDIwLjk5OCwyMiwyMC45OTgsMjIsMjAuOTk4eiBNMTIuNDc3LDljLTIuNDg1LDAtNC41LTIuMDE1LTQuNS00LjVTOS45OTEsMCwxMi40NzcsMCAgczQuNSwyLjAxNSw0LjUsNC41UzE0Ljk2Miw5LDEyLjQ3Nyw5eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+',
    circle: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gULEBE3DEP64QAAAwlJREFUaN7dmktrU0EUx38ZmmBbfEIL2hSjkYKC1EW6EDFudC+404/gE6WKSvGxERQfIH4AX1T9EOKrCrYurVrbgsZWoaBVixDbpC6ci+Fyz9ybZG478cBs7syc+Z+5c86c+c8ksCPrgW1ADtgEbARafG1+AW+AYWAIGADGWUTZAJwHxoD5GssocA7ILiTwLcADoFQHcH8pAfeB7jiBtwO3gLJF4P5S1mO02wa/C5iMEbi/TAI7bYE/Y3m5VLOs+sLAJULqrgKHIxhZBp4DT4FX2jkLGoinq1M7fg7YDmwFVATd14CjFboiy5UIs/QBOAmka/izaeCU1hE2zuVqlZ8IUfgVOAA0WViiTcBBrdM0Zm9UhTuAOYOiRzXOeJh0Ak8M484B+TAlK4BPBiU3gWSMoTqpw6g0fgFYblJww9D5dojT25IEcMeA47rUsdsQLp9FmPmURSNSOqpJS2lzUKd+ocN3IBNx5mz+oXXADwHTXX/jjMFxjy1iwtgrYJoF1lY27BMafozZaaMspYKA7XRlw7f1xt4Y5biA7bXXIGv4TW0OGNCmsQRhzCidlwTJADDlgAFTwAuhLq+AHqHyMe6IhKVHAV1C5ZBDBkhYupThPPreIQNGJTJBGXKLLw4Z8NmQu/Fb8PCkQwakBIxFRWPLvAJmhMpWh4AuFb7PKGBaqFzjkAGrhe/TSjNrQZJ1yAAJy5gCRoTKnEMGSFhGFDBoOBu7IhKWQe8wLRFLHQ6A7zCcFNNK59vvAjoqYK8DBuwTCLBhTUD8Hweahj9S2jjU297VqzrU26BVmi2yEjXRKg1PbHnpqYla7AeWxAi+GbhHHdSit2mYyN2XQQ5kQTJ6Y6qL3PUkCr2+H7v0+jcs0eueRLngGNeKa9mxY73g8JzpEtHusorAQ/7e+e7WUWIl//jSVTrK7QEu6KgW9d7tYr3B44iBWPJfkZZ8pZ4r2VngkC0HywMTLNwN5YSBcKtZWoGzernEBbyox2iJc6Np2KcGfnHisYet1CDouc2yCjbhp07MrD+3+QNxi4JkAscRswAAAABJRU5ErkJggg==',
    signal: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><polygon stroke-width="1.5" stroke="#000" fill-opacity="0" stroke-miterlimit="10" points="6.386,32 20.192,8.087 33.997,32"></polygon></svg>',
    'system-error': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><polygon stroke-width="1.5" stroke="#000" fill-opacity="0" stroke-miterlimit="10" points="6.522,23.354 12.917,4.43 24.157,20.146 33.478,11.125 25.555,35.57 12.931,16.07"></polygon></svg>',
    'flow-error': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><polygon stroke-width="1.5" stroke="#000" fill-opacity="0" stroke-miterlimit="10" points="3.455,32.607 20.546,3.003 37.638,32.607 20.546,25.541"></polygon></svg>',
    terminate: 'data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" version="1.1"><circle stroke-width="1.5" stroke="#000" fill-opacity="0" stroke-miterlimit="10" cx="20" cy="20" r="19"></circle></svg>',
    timer: 'data:image/svg+xml;utf8,<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40px" height="40px" viewBox="80 80 40 40" enable-background="new 80 80 40 40" xml:space="preserve"><g><g><g><path stroke-width="1.5" d="M104.673,101.857c0,0.29-0.236,0.526-0.527,0.526h-8.583c-0.051,0-0.099-0.006-0.144-0.021 c-0.016-0.005-0.032-0.011-0.048-0.018c-0.025-0.011-0.051-0.021-0.074-0.036c-0.021-0.012-0.042-0.024-0.062-0.039 c-0.001-0.003-0.006-0.005-0.008-0.007c-0.019-0.017-0.038-0.034-0.055-0.053c-0.051-0.057-0.091-0.123-0.114-0.2 c-0.008-0.025-0.013-0.05-0.017-0.075c-0.004-0.025-0.006-0.053-0.006-0.078c0-0.019,0-0.035,0.002-0.055 c0.004-0.029,0.01-0.061,0.019-0.09c0.004-0.018,0.01-0.033,0.017-0.049c0.002-0.006,0.004-0.013,0.008-0.021l5.01-12.751 c0.105-0.271,0.411-0.404,0.683-0.297c0.269,0.105,0.404,0.411,0.296,0.683l-4.736,12.053h7.811 C104.437,101.33,104.673,101.566,104.673,101.857z"/> </g> </g> <path stroke-width="1.5" d="M99.999,81.479c-10.213,0-18.522,8.309-18.522,18.521c0,10.213,8.309,18.521,18.522,18.521 c10.215,0,18.523-8.31,18.523-18.521C118.522,89.788,110.214,81.479,99.999,81.479z M116.083,107.55l-2.01-1.048l-0.654,1.251 l2.012,1.05c-1.325,2.316-3.159,4.307-5.347,5.818l-1.064-1.539l-1.161,0.803l1.033,1.494c-2.426,1.408-5.215,2.258-8.187,2.374 v-1.876h-1.411v1.876c-2.973-0.116-5.762-0.966-8.188-2.374l1.034-1.494l-1.162-0.803l-1.063,1.539 c-2.188-1.512-4.022-3.502-5.348-5.818l2.011-1.05l-0.653-1.251l-2.01,1.048c-0.988-2.091-1.576-4.405-1.671-6.845h2.14v-1.41 h-2.139c0.095-2.439,0.684-4.753,1.671-6.844l2.009,1.048l0.654-1.252l-2.012-1.05c1.326-2.316,3.16-4.306,5.348-5.817l1.064,1.538 l1.162-0.802l-1.034-1.494c2.426-1.409,5.215-2.258,8.188-2.375v1.876h1.411v-1.876c2.972,0.116,5.761,0.966,8.187,2.374 l-1.033,1.494l1.161,0.803l1.064-1.539c2.188,1.511,4.021,3.502,5.347,5.817l-2.012,1.05l0.654,1.252l2.01-1.048 c0.987,2.091,1.575,4.405,1.671,6.845h-2.14v1.41h2.14C117.658,103.145,117.07,105.459,116.083,107.55z"/></g></svg>',
    signalThrowing: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><polygon stroke-miterlimit="10" points="6.386,32 20.192,8.087 33.997,32"></polygon></svg>',
    'system-errorThrowing': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><polygon stroke-miterlimit="10" points="6.522,23.354 12.917,4.43 24.157,20.146 33.478,11.125 25.555,35.57 12.931,16.07"></polygon></svg>',
    'flow-errorThrowing': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><polygon stroke-miterlimit="10" points="3.455,32.607 20.546,3.003 37.638,32.607 20.546,25.541"></polygon></svg>',
    terminateThrowing: 'data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" version="1.1"><circle stroke-miterlimit="10" cx="20" cy="20" r="19"></circle></svg>'
  };

  joint.shapes.liveOps.IconInterface = {
    initialize: function() {
      // In order to be able to use multiple interfaces for one Backbone.model, we need to keep
      // reference to the actual parent class prototype.
      this._parent = (this._parent || this).constructor.__super__;
      this._parent.initialize.apply(this, arguments);
      this.listenTo(this, 'change:icon', this._onIconChange);
      this._onIconChange(this, this.get('icon') || 'none');
    },
    _onIconChange: function(cell, icon) {
      var icons = joint.shapes.liveOps.icons;
      if (_.has(icons, icon)) {
        cell.attr('image/xlink:href', icons[icon]);
      } else {
        throw 'BPMN: Unknown icon: ' + icon;
      }
    }
  };

  joint.shapes.liveOps.SubProcessInterface = {
    initialize: function() {
      // See IconInterface.initalize()
      this._parent = (this._parent || this).constructor.__super__;
      this._parent.initialize.apply(this, arguments);
      this.listenTo(this, 'change:subProcess', this._onSubProcessChange);
      this._onSubProcessChange(this, this.get('subProcess') || null);
    },
    _onSubProcessChange: function(cell, subProcess) {
      cell.attr({
        '.sub-process': {
          visibility: subProcess ? 'visible' : 'hidden',
          'data-sub-process': subProcess || ''
        }
      });
    }
  };
})();
