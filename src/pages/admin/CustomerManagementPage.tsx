import { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { UserRole } from '../../models/types';
import { Shield, ShieldAlert, Award, Star, Mail, Phone, Calendar, ArrowUpRight, ArrowDownRight, UserCheck } from 'lucide-react';
import { Badge, Button } from '../../components/ui/atoms';

export function CustomerManagementPage() {
  const { allUsers, currentUser, updateUserRole } = useRudrax();
  const [elevatingUid, setElevatingUid] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string>('');

  const isOwner = currentUser?.role === 'SuperAdmin';

  // Statistics
  const totalUsers = allUsers.length;
  const adminCount = allUsers.filter(u => u.role === 'Admin' || u.role === 'SuperAdmin').length;
  const customerCount = allUsers.filter(u => u.role === 'Customer').length;
  const eliteUsers = allUsers.filter(u => u.loyaltyPoints >= 1000).length;

  const handleRoleToggle = async (uid: string, currentRole: UserRole) => {
    if (!isOwner) return;
    setElevatingUid(uid);
    setSuccessInfo('');

    const targetRole: UserRole = currentRole === 'Admin' ? 'Customer' : 'Admin';
    try {
      await updateUserRole(uid, targetRole);
      setSuccessInfo(`Role changed to ${targetRole} successfully!`);
      setTimeout(() => setSuccessInfo(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setElevatingUid(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Title Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Registered Members Directory</h1>
          <p className="text-xs text-slate-500 font-bold tracking-wide mt-1.5 uppercase font-mono">
            {isOwner ? '🔐 Ownership Console: Access Privilege Control Panel' : '📋 Customer Logs and Loyalty Analytics'}
          </p>
        </div>
      </div>

      {/* KPI Stats block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border text-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Total Registrations</span>
          <span className="text-2xl font-black font-mono">{totalUsers}</span>
          <span className="text-[10px] text-teal-600 font-bold block mt-1">Active Google Credentials</span>
        </div>
        <div className="bg-white border text-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Staff Operators</span>
          <span className="text-2xl font-black font-mono text-emerald-600">{adminCount}</span>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">SuperAdmins + Admins</span>
        </div>
        <div className="bg-white border text-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Standard Customers</span>
          <span className="text-2xl font-black font-mono text-blue-600">{customerCount}</span>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">Consumer Storefront Accounts</span>
        </div>
        <div className="bg-white border text-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Elite Members (1000+ LP)</span>
          <span className="text-2xl font-black font-mono text-amber-500">{eliteUsers}</span>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">High Loyalty Tiers</span>
        </div>
      </div>

      {successInfo && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl text-xs font-semibold">
          ✓ {successInfo}
        </div>
      )}

      {/* Database Directory List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>👥 Accounts Roster ({totalUsers})</span>
          {isOwner && (
            <span className="bg-rose-50 text-rose-700 font-bold text-[10px] px-2 py-0.5 rounded border border-rose-100 font-mono flex items-center gap-1">
              <ShieldAlert size={12} /> God Admin Active
            </span>
          )}
        </h3>

        {allUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-semibold">
            Retrieving account records from secure Google Firestore...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Member Info</th>
                  <th className="py-3 px-3">Role Privilege</th>
                  <th className="py-3 px-3 font-mono">Loyalty Points</th>
                  <th className="py-3 px-3">Created</th>
                  {isOwner && <th className="py-3 px-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                {allUsers.map((user) => {
                  const isProtected = user.role === 'SuperAdmin' || user.uid === currentUser?.uid;
                  return (
                    <tr key={user.uid} className="hover:bg-slate-50/40">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.name} className="h-9 w-9 rounded-xl object-cover border border-slate-200" referrerPolicy="referrer" />
                          ) : (
                            <div className="h-9 w-9 bg-slate-100 border rounded-xl flex items-center justify-center font-bold text-slate-600 uppercase">
                              {user.name ? user.name[0] : 'U'}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{user.name || 'Valued Customer'}</span>
                            <span className="text-[10px] text-slate-400 font-bold font-mono leading-none mt-0.5 block flex items-center gap-1">
                              <Mail size={11} /> {user.email} {user.phone && `| 📞 ${user.phone}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {user.role === 'SuperAdmin' ? (
                          <span className="bg-purple-100 text-purple-800 border border-purple-200 font-bold text-[10px] px-2.5 py-1 rounded-xl flex items-center gap-1 w-max">
                            <Shield size={12} className="fill-purple-800/10" /> SuperAdmin
                          </span>
                        ) : user.role === 'Admin' ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] px-2.5 py-1 rounded-xl flex items-center gap-1 w-max">
                            <Award size={12} className="fill-emerald-800/10" /> Administrator
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[10px] px-2.5 py-1 rounded-xl flex items-center gap-1 w-max">
                            <Star size={12} className="fill-slate-600/10" /> standard Customer
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                        ⭐ {user.loyaltyPoints || 0} pts
                      </td>

                      <td className="py-3.5 px-3 text-slate-450 text-[11px] font-mono">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {isOwner && (
                        <td className="py-3.5 px-3 text-right">
                          {isProtected ? (
                            <span className="text-[10px] text-slate-400 font-bold select-none cursor-not-allowed">
                              🔒 Non-changeable
                            </span>
                          ) : (
                            <button
                              disabled={elevatingUid === user.uid}
                              onClick={() => handleRoleToggle(user.uid, user.role)}
                              className={`text-[10px] font-black tracking-tight px-3 py-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer flex items-center gap-1 ml-auto ${
                                user.role === 'Admin'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                              }`}
                            >
                              <UserCheck size={12} />
                              {user.role === 'Admin' ? 'Demote to Customer' : 'Elevate to Admin'}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerManagementPage;
