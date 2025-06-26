// Shared Community Data Management
class CommunityManager {
    constructor() {
        this.initializeDefaultCommunities();
    }

    // Initialize default communities data
    initializeDefaultCommunities() {
        const defaultCommunities = {
            'Pandawara': {
                name: 'Pandawara',
                description: 'Komunitas peduli lingkungan yang fokus pada pembersihan dan edukasi.',
                image: 'Gambar/commu1.jpeg',
                events: ['Bersih Pantai', 'Edukasi Lingkungan'],
                members: [
                    { name: 'Alya', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
                    { name: 'Raka', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
                ],
                isDefault: true
            },
            'R3 Community': {
                name: 'R3 Community',
                description: 'Reduce, Reuse, Recycle - Komunitas untuk gaya hidup berkelanjutan.',
                image: 'Gambar/commu2.jpg',
                events: ['Workshop Daur Ulang', 'Kampanye Zero Waste'],
                members: [
                    { name: 'Bimo', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
                    { name: 'Dewi', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
                ],
                isDefault: true
            },
            'Recycle.id': {
                name: 'Recycle.id',
                description: 'Platform komunitas nasional untuk berbagi inspirasi dan aksi nyata daur ulang.',
                image: 'Gambar/commu3.jpeg',
                events: ['Webinar Recycle 101', 'Kompetisi Inovasi Daur Ulang'],
                members: [
                    { name: 'Mike', avatar: 'https://randomuser.me/api/portraits/men/41.jpg' },
                    { name: 'Brita', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }
                ],
                isDefault: true
            },
            'CleanUp': {
                name: 'CleanUp',
                description: 'Komunitas aksi bersih lingkungan di berbagai daerah.',
                image: 'Gambar/commu4.jpeg',
                events: ['Bersih Sungai', 'Pembersihan Hutan'],
                members: [
                    { name: 'Andi', avatar: 'https://randomuser.me/api/portraits/men/50.jpg' }
                ],
                isDefault: true
            },
            'Cinta Lingkungan': {
                name: 'Cinta Lingkungan',
                description: 'Komunitas pecinta alam dan lingkungan hidup.',
                image: 'Gambar/commu5.jpg',
                events: ['Tanam Pohon', 'Edukasi Anak'],
                members: [
                    { name: 'Sari', avatar: 'https://randomuser.me/api/portraits/women/55.jpg' }
                ],
                isDefault: true
            }
        };

        // Store default communities if not exists
        if (!localStorage.getItem('allCommunities')) {
            localStorage.setItem('allCommunities', JSON.stringify(defaultCommunities));
        }
    }

    // Get all communities (default + custom)
    getAllCommunities() {
        try {
            return JSON.parse(localStorage.getItem('allCommunities') || '{}');
        } catch (error) {
            console.error('Error getting communities:', error);
            return {};
        }
    }

    // Add new community
    addCommunity(communityData) {
        try {
            const communities = this.getAllCommunities();
            const key = communityData.name.replace(/\s+/g, '_') + '_' + Date.now();

            communities[key] = {
                name: communityData.name,
                description: communityData.description,
                image: communityData.image || 'https://via.placeholder.com/150?text=' + encodeURIComponent(communityData.name),
                events: communityData.events || [],
                members: communityData.members || [],
                isDefault: false,
                dateCreated: new Date().toISOString()
            };

            localStorage.setItem('allCommunities', JSON.stringify(communities));

            // Trigger event for homepage to update
            window.dispatchEvent(new CustomEvent('communityAdded', {
                detail: { community: communities[key], key: key }
            }));

            return key;
        } catch (error) {
            console.error('Error adding community:', error);
            return null;
        }
    }

    // Get top communities for homepage (default limit increased)
    getTopCommunities(limit = 20) {
        const communities = this.getAllCommunities();
        const joinedCommunities = this.getJoinedCommunities();

        // Sort by: joined first, then by member count, then by date created
        const sortedCommunities = Object.entries(communities)
            .map(([key, community]) => ({
                key,
                ...community,
                isJoined: joinedCommunities.includes(key),
                memberCount: community.members ? community.members.length : 0
            }))
            .sort((a, b) => {
                // Joined communities first
                if (a.isJoined && !b.isJoined) return -1;
                if (!a.isJoined && b.isJoined) return 1;

                // Then by member count
                if (b.memberCount !== a.memberCount) {
                    return b.memberCount - a.memberCount;
                }

                // Then by creation date (newer first)
                if (!a.isDefault && !b.isDefault) {
                    return new Date(b.dateCreated || 0) - new Date(a.dateCreated || 0);
                }

                return 0;
            })
            .slice(0, limit);

        return sortedCommunities;
    }

    // Get joined communities
    getJoinedCommunities() {
        try {
            return JSON.parse(localStorage.getItem('joinedCommunities') || '[]');
        } catch (error) {
            console.error('Error getting joined communities:', error);
            return [];
        }
    }

    // Join/Leave community
    toggleJoinCommunity(communityKey) {
        try {
            const joinedCommunities = this.getJoinedCommunities();
            const index = joinedCommunities.indexOf(communityKey);

            if (index > -1) {
                // Leave community
                joinedCommunities.splice(index, 1);
            } else {
                // Join community
                joinedCommunities.push(communityKey);
            }

            localStorage.setItem('joinedCommunities', JSON.stringify(joinedCommunities));

            // Trigger event for UI updates
            window.dispatchEvent(new CustomEvent('communityToggled', {
                detail: { communityKey, isJoined: index === -1 }
            }));

            return index === -1; // Return true if joined, false if left
        } catch (error) {
            console.error('Error toggling community membership:', error);
            return false;
        }
    }

    // Check if user has joined a community
    isJoined(communityKey) {
        return this.getJoinedCommunities().includes(communityKey);
    }

    // Get favorite communities
    getFavoriteCommunities() {
        try {
            return JSON.parse(localStorage.getItem('favoriteCommunities') || '[]');
        } catch (error) {
            console.error('Error getting favorite communities:', error);
            return [];
        }
    }

    // Toggle favorite community
    toggleFavoriteCommunity(communityKey) {
        try {
            const favorites = this.getFavoriteCommunities();
            const index = favorites.indexOf(communityKey);

            if (index > -1) {
                favorites.splice(index, 1);
            } else {
                favorites.push(communityKey);
            }

            localStorage.setItem('favoriteCommunities', JSON.stringify(favorites));

            // Trigger event for UI updates
            window.dispatchEvent(new CustomEvent('communityFavoriteToggled', {
                detail: { communityKey, isFavorite: index === -1 }
            }));

            return index === -1;
        } catch (error) {
            console.error('Error toggling favorite community:', error);
            return false;
        }
    }

    // Check if community is favorite
    isFavorite(communityKey) {
        return this.getFavoriteCommunities().includes(communityKey);
    }
}

// Create global instance
window.communityManager = new CommunityManager();
