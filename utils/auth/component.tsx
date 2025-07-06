export interface Props {
  text: string;
}

export const signinLinkComponent = (signinPath: string) => {
  return (props: Props) => <a href={signinPath}>{props.text}</a>;
};
export const signupLinkComponent = (signupPath: string) => {
  return (props: Props) => <a href={signupPath}>{props.text}</a>;
};
