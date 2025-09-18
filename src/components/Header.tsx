import React, { useState } from 'react';
import { Settings, User, LogIn } from 'lucide-react';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import AuthService, { User as UserType } from '../services/auth';

interface HeaderProps {
  onSettingsClick: () => void;
  user: UserType | null;
  onUserChange: (user: UserType | null) => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, user, onUserChange }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleAuthSuccess = (user: UserType) => {
    onUserChange(user);
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    onUserChange(null);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">FridgeMind</h1>
            </div>
            <div className="flex items-center space-x-2">
              {user ? (
                <button
                  onClick={() => setShowUserProfile(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  title={user.name}
                >
                  <User className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-2 text-sm text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
              <button
                onClick={onSettingsClick}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* User Profile Modal */}
      {showUserProfile && user && (
        <UserProfile
          user={user}
          onSignOut={handleSignOut}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </>
  );
};

export default Header;
