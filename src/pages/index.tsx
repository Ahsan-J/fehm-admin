import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { authRoutes } from '../constant/app';

const MainIndex: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard")
    }, [router])

    return null;    
}

export default MainIndex;