import { Spinner } from "@/components/ui/spinner";

export default function LoadingScreen() {
  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50'>
      <Spinner className="w-10 h-10" /> 
    </div>
  ); 
}