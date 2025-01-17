import { Tensor, Tensor1D, Tensor2D, Tensor3D, Tensor4D } from '../tensor';
import { Rank, ShapeMap } from '../types';
export declare class Ops {
    static slice1d(x: Tensor1D, begin: number, size: number): Tensor1D;
    static slice2d(x: Tensor2D, begin: [number, number], size: [number, number]): Tensor2D;
    static slice3d(x: Tensor3D, begin: [number, number, number], size: [number, number, number]): Tensor3D;
    static slice4d(x: Tensor4D, begin: [number, number, number, number], size: [number, number, number, number]): Tensor4D;
    static slice<R extends Rank>(x: Tensor<R>, begin: ShapeMap[R], size: ShapeMap[R]): Tensor<R>;
}
