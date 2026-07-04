import React, { useState, FormEvent } from 'react';

interface FormState {
    subjectDid: string;
    credentialType: string;
    fullName: string;
    nationalId: string;
}

export const IssueCredentialForm: React.FC = () => {
    const [formData, setFormData] = useState<FormState>({
        subjectDid: '',
        credentialType: 'KYCIdentityCredential',
        fullName: '',
        nationalId: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage(null);

        try {
            const response = await fetch('/api/v1/credentials/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subjectDid: formData.subjectDid,
                    issuerDid: 'did:nexus:org:nexuscore-main-authority',
                    credentialType: formData.credentialType,
                    claims: {
                        fullName: formData.fullName,
                        nationalId: formData.nationalId,
                        verificationTimestamp: new Date().toISOString()
                    },
                    expirationDays: 365
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Issuance operation failure.');

            setStatusMessage({ type: 'success', text: `Credential registered with ID: ${result.credentialId}` });
            setFormData({ subjectDid: '', credentialType: 'KYCIdentityCredential', fullName: '', nationalId: '' });
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.message || 'Network system exception encountered.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Issue Verifiable Identity Credential</h2>
            <p className="text-sm text-gray-500 mb-6">Signs and issues a W3C-compliant security assertion token mapped directly to a user's unique decentralized identifier.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Subject DID Target Link</label>
                    <input 
                        type="text" 
                        required
                        placeholder="did:nexus:..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder-gray-400"
                        value={formData.subjectDid}
                        onChange={(e) => setFormData({ ...formData, subjectDid: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Full Legal Name</label>
                        <input 
                            type="text" required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">National ID Identifier</label>
                        <input 
                            type="text" required
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            value={formData.nationalId}
                            onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 text-white font-medium rounded-lg text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Executing HSM Cryptographic Issuance...' : 'Sign & Issue Identity Block'}
                </button>
            </form>

            {statusMessage && (
                <div className={`mt-6 p-4 rounded-lg border text-sm ${
                    statusMessage.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                    {statusMessage.text}
                </div>
            )}
        </div>
    );
};