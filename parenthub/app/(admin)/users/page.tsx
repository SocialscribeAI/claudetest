"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Role = "PARENT" | "PROVIDER" | "ADMIN";
type Status = "ACTIVE" | "SUSPENDED";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  createdAt: string;
  lastActiveAt: string;
  favorites: number;
  reviews: number;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "שרה כהן",
    email: "sarah@example.com",
    phone: "050-1234567",
    role: "PARENT",
    status: "ACTIVE",
    createdAt: "2024-01-15",
    lastActiveAt: "2024-01-20",
    favorites: 12,
    reviews: 3,
  },
  {
    id: "2",
    name: "דוד לוי",
    email: "david@example.com",
    phone: "052-9876543",
    role: "PARENT",
    status: "ACTIVE",
    createdAt: "2024-01-10",
    lastActiveAt: "2024-01-19",
    favorites: 5,
    reviews: 1,
  },
  {
    id: "3",
    name: "מרים אברהם",
    email: "miriam@provider.com",
    phone: "054-5555555",
    role: "PROVIDER",
    status: "ACTIVE",
    createdAt: "2024-01-05",
    lastActiveAt: "2024-01-20",
    favorites: 0,
    reviews: 0,
  },
  {
    id: "4",
    name: "יעקב גולד",
    email: "yaakov@example.com",
    phone: "053-1111111",
    role: "PARENT",
    status: "SUSPENDED",
    createdAt: "2023-12-20",
    lastActiveAt: "2024-01-05",
    favorites: 2,
    reviews: 0,
  },
  {
    id: "5",
    name: "רחל מנהלת",
    email: "rachel@admin.com",
    phone: "050-9999999",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2023-11-01",
    lastActiveAt: "2024-01-20",
    favorites: 0,
    reviews: 0,
  },
];

type RoleFilter = "all" | Role;
type StatusFilter = "all" | Status;

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<Role>("PARENT");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "ACTIVE" ? ("SUSPENDED" as const) : ("ACTIVE" as const) }
          : u
      )
    );
  };

  const handleChangeRole = () => {
    if (selectedUser) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u)));
      setShowRoleModal(false);
      setSelectedUser(null);
    }
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "PROVIDER":
        return "bg-blue-100 text-blue-800";
      case "PARENT":
        return "bg-green-100 text-green-800";
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "מנהל";
      case "PROVIDER":
        return "נותן שירות";
      case "PARENT":
        return "הורה";
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול משתמשים</h1>
          <p className="text-gray-600 mt-1">{users.length} משתמשים רשומים</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          ייצוא
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש לפי שם, אימייל או טלפון..."
                className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">כל התפקידים</option>
            <option value="PARENT">הורים</option>
            <option value="PROVIDER">נותני שירות</option>
            <option value="ADMIN">מנהלים</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="ACTIVE">פעיל</option>
            <option value="SUSPENDED">מושהה</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">סה״כ משתמשים</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">הורים</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.role === "PARENT").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">נותני שירות</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.role === "PROVIDER").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">מושהים</p>
          <p className="text-2xl font-bold text-red-600">
            {users.filter((u) => u.status === "SUSPENDED").length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">משתמש</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">טלפון</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">תפקיד</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">סטטוס</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">פעילות</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">פעילות אחרונה</th>
                <th className="text-start px-4 py-3 text-sm font-medium text-gray-600">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                        getRoleBadge(user.role)
                      )}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {user.status === "ACTIVE" ? "פעיל" : "מושהה"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p className="text-gray-600">♥ {user.favorites} מועדפים</p>
                      <p className="text-gray-600">★ {user.reviews} ביקורות</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.lastActiveAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.role);
                          setShowRoleModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="שינוי תפקיד"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          user.status === "ACTIVE"
                            ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                        )}
                        title={user.status === "ACTIVE" ? "השהה משתמש" : "הפעל משתמש"}
                      >
                        {user.status === "ACTIVE" ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">לא נמצאו משתמשים</p>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">שינוי תפקיד</h3>
            <p className="text-gray-600 mb-4">שינוי תפקיד עבור: {selectedUser.name}</p>

            <div className="space-y-2 mb-6">
              {(["PARENT", "PROVIDER", "ADMIN"] as Role[]).map((role) => (
                <label
                  key={role}
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                    newRole === role ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    checked={newRole === role}
                    onChange={() => setNewRole(role)}
                    className="text-pink-500 focus:ring-pink-500"
                  />
                  <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getRoleBadge(role))}>
                    {getRoleLabel(role)}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={handleChangeRole}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors"
              >
                שמור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
