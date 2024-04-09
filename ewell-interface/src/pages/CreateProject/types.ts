export interface CreateStepProps {
  onNext?: () => void;
  onPre?: () => void;
}

export enum TSteps {
  ONE,
  TWO,
  THREE,
  FOUR,
}
