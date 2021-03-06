import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TuringMachineService } from '../turing-machine.service';
import { Delta, State, StateType } from '../utils';

@Component({
  selector: 'app-state-data',
  templateUrl: './state-data.component.html',
  styleUrls: ['./state-data.component.css']
})
export class StateDataComponent implements OnInit {

  state?: State;
  deltas: Delta[] = [];
  input: string = '';
  nextStateId?: number;
  stateTypes: StateType[] = [
    StateType.INITIAL_STATE,
    StateType.MIDDLE_STATE,
    StateType.FINAL_STATE
  ];

  constructor(
    @Inject (MAT_DIALOG_DATA) public data: number,
    public dialogRef: MatDialogRef<StateDataComponent>,
    public turingMachine: TuringMachineService
  ) {}

  ngOnInit(): void {
    this.turingMachine.states$.subscribe((states) => {
      this.state = this.turingMachine.getStateById(this.data);
    });
    this.turingMachine.deltas$.subscribe((deltas) => {
      this.deltas = this.turingMachine.getDeltasById(this.data);
    });
  }

  onDeltaAddClicked(): void {
    if (this.nextStateId === undefined){
      throw Error('undefined next state id');
    }
    this.turingMachine.addDelta(this.state!.id, this.input.split(' '), this.nextStateId);
  }

  onDeltaDeleteClicked(delta: Delta): void {
    this.turingMachine.deleteDelta(delta.prevStateId, delta.input, delta.newStateId);
  }

  onActionClicked(stateId: number, action: string): void {
    this.turingMachine.addAction(stateId, action);
  }

  onActionDeleteClicked(stateId: number): void {
    this.turingMachine.deleteAction(stateId);
  }
}
