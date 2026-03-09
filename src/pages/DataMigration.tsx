import React, { useState } from 'react';
import { migrateDataToFirebase } from '../utils/migrateData';
import { Button } from "@/components/ui/button";
import { Database, CheckCircle, XCircle } from 'lucide-react';

const DataMigration = () => {
    const [status, setStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleMigrate = async () => {
        setStatus('migrating');
        setMessage('Migrating data to Firebase...');

        const result = await migrateDataToFirebase();

        if (result.success) {
            setStatus('success');
            setMessage('✅ All data migrated successfully! You can now close this page.');
        } else {
            setStatus('error');
            setMessage('❌ Migration failed. Check console for details.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Database className="w-8 h-8 text-iare-blue" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Migration</h1>
                    <p className="text-gray-600">
                        Click the button below to migrate existing data to Firebase
                    </p>
                </div>

                {status === 'idle' && (
                    <Button
                        onClick={handleMigrate}
                        className="w-full bg-iare-blue hover:bg-blue-700"
                    >
                        Start Migration
                    </Button>
                )}

                {status === 'migrating' && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iare-blue mx-auto mb-4"></div>
                        <p className="text-gray-600">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <p className="text-green-700 font-semibold">{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-red-700 font-semibold">{message}</p>
                        <Button
                            onClick={handleMigrate}
                            className="mt-4 bg-iare-blue hover:bg-blue-700"
                        >
                            Retry
                        </Button>
                    </div>
                )}

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Run this migration only once. After successful migration, you can delete this page.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DataMigration;
