import { Confirmation } from '@/components/order-experience';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'Demo order receipt',robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{id:string}>}){return <Confirmation id={(await params).id}/>;}
