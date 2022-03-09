export class Case {
    private _state;
    constructor(state: number) {
      this._state = state;
    }
  
    get state(): number {
      return this._state;
    }
  
    set state(state: number) {
      this._state = state;
    }
  
    isEmpty(): boolean {
      return this._state === 'o';
    }
  
    isRed(): boolean {
      return this._state === '1';
    }
  
    isYellow(): boolean {
      return this._state === '2';
    }
  }
  