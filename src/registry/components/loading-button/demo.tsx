import { LoadingButton } from "./loading-button";

function saveChanges() {
  return new Promise<void>((resolve) => setTimeout(resolve, 1400));
}

export default function LoadingButtonDemo() {
  return <LoadingButton onClick={saveChanges}>Save changes</LoadingButton>;
}
