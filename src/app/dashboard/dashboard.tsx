"use client";

import { SignOutButton } from "@/src/components/sign-out-button";
import { getUserName } from "@/src/lib/auth/getUserNameServerAction";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiVideo, FiImage, FiZap, FiMenu, FiLogOut, FiUser, FiPlus, FiCreditCard, FiTrendingUp } from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";

export const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const { data: session, update } = useSession();

  useEffect(() => {
    const userInfo = async () => {
      const name = await getUserName();
      if (name) {
        setUsername(name);
      }
    };
    userInfo();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl bg-slate-900/70 backdrop-blur border border-white/10">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-medium text-white">Welcome back, <span className="text-blue-400">{session?.user?.name}</span></h1>
              <p className="text-sm text-slate-400">Access your AI tools and manage resources</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <FiCreditCard className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-white">500 Credits</span>
              </div>
              <Menu as="div" className="relative">
                <Menu.Button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <FiMenu className="w-5 h-5 text-white" />
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-xl divide-y divide-white/5 border border-white/10 shadow-xl z-50">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button className={`${active ? 'bg-white/10' : ''} flex items-center gap-3 w-full px-4 py-2 text-sm text-white rounded-lg transition-colors`}>
                          <FiUser className="w-4 h-4 text-white" />
                          Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <SignOutButton className={`${active ? 'bg-white/10' : ''} flex items-center gap-3 w-full px-4 py-2 text-sm text-white rounded-lg transition-colors`}>
                          <FiLogOut className="w-4 h-4 text-white" />
                          Sign out
                        </SignOutButton>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          </div>
          <div className="p-4 overflow-x-auto">
            <div className="flex gap-4 min-w-max sm:grid sm:grid-cols-3 sm:min-w-0">
              <div className="relative flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 w-[180px] sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <FiCreditCard className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Credits</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-semibold text-white">500</p>
                  </div>
                </div>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <FiPlus className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 w-[180px] sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <FiImage className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Images</p>
                  <p className="text-2xl font-semibold text-white">1,234</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 w-[180px] sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <FiVideo className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Videos</p>
                  <p className="text-2xl font-semibold text-white">56</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Tools Section */}
        <div className="mt-6 rounded-2xl bg-slate-900/70 backdrop-blur border border-white/10">
          <div className="p-4">
            <h2 className="text-lg font-medium text-white">AI Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pt-0">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <FiImage className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Codeformer</h3>
                  <p className="text-sm text-slate-400">Enhance and restore face images</p>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-sm text-white font-medium hover:opacity-90 transition-opacity">
                Enhance Image
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-70">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <FiVideo className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Video Generation</h3>
                  <p className="text-sm text-slate-400">Create AI-powered videos</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-white/70 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Coming Soon
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-70">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <FiZap className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Quick Edit</h3>
                  <p className="text-sm text-slate-400">Quick image editing and filters</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-white/70 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
