import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import Model from './model';

interface SceneProps {
  imageUrl: string;
}

export default function Scene({ imageUrl }: SceneProps) {
  return (
    <div className='h-full w-full relative'>
      <Canvas>
        <OrthographicCamera
          makeDefault
          position={[0, 0, 2]}
        />
        <Model imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
}
