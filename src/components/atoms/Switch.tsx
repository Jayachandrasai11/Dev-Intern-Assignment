import * as RadixSwitch from '@radix-ui/react-switch';

export type SwitchProps = RadixSwitch.SwitchProps;

export function Switch(props: SwitchProps) {
  return (
    <RadixSwitch.Root className="ev-switch" {...props}>
      <RadixSwitch.Thumb className="ev-switch__thumb" />
    </RadixSwitch.Root>
  );
}
