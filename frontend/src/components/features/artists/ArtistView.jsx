import React from 'react';
import { Chip, IconButton } from '@material-tailwind/react';
import { FiMusic, FiMail, FiPhone, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import DOMPurify from 'dompurify';

/**
 * Artist View component
 * Read-only display of artist details for the Modal
 */
function ArtistView({ artist }) {
    if (!artist) return null;

    const statusColorMap = {
        active: 'green',
        inactive: 'gray',
        pending: 'amber',
    };

    return (
        <div className="space-y-6">
            {/* Header Image Area */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                {(artist.imageUrl?.url || artist.imageUrl) ? (
                    <img
                        src={artist.imageUrl?.url || artist.imageUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-white flex items-center justify-center text-primary-500">
                        <FiMusic className="w-16 h-16 opacity-50" aria-hidden="true" />
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Chip
                        value={artist.status}
                        color={statusColorMap[artist.status] || 'gray'}
                        className="bg-white/90 text-slate-700 shadow backdrop-blur-sm"
                    />
                </div>
            </div>

            {/* Main Info */}
            <div className="space-y-4 px-2">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900">{artist.name}</h3>
                    {artist.genre && (
                        <p className="text-lg text-primary-600 font-medium mt-1">{artist.genre}</p>
                    )}
                </div>

                {artist.bio && (
                    <div className="prose prose-slate max-w-none">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Biography</h4>
                        <div
                            className="text-slate-700 leading-relaxed quill-content"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(artist.bio) }}
                        />
                    </div>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    {(artist.contactEmail || artist.contactPhone) && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Contact Details</h4>
                            <div className="space-y-2">
                                {artist.contactEmail && (
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <FiMail className="w-5 h-5 text-slate-400" />
                                        <a href={`mailto:${artist.contactEmail}`} className="hover:text-primary-600 transition-colors">
                                            {artist.contactEmail}
                                        </a>
                                    </div>
                                )}
                                {artist.contactPhone && (
                                    <div className="flex items-center gap-3 text-slate-700">
                                        <FiPhone className="w-5 h-5 text-slate-400" />
                                        <a href={`tel:${artist.contactPhone}`} className="hover:text-primary-600 transition-colors">
                                            {artist.contactPhone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Social Media */}
                    {artist.socialMedia && (artist.socialMedia.instagram || artist.socialMedia.twitter || artist.socialMedia.youtube) && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Social Media</h4>
                            <div className="flex flex-wrap gap-2">
                                {artist.socialMedia.instagram && (
                                    <a href={`https://instagram.com/${artist.socialMedia.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                                        <IconButton variant="text" color="pink" className="rounded-full bg-pink-50 hover:bg-pink-100">
                                            <FiInstagram className="w-5 h-5" />
                                        </IconButton>
                                    </a>
                                )}
                                {artist.socialMedia.twitter && (
                                    <a href={`https://twitter.com/${artist.socialMedia.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                                        <IconButton variant="text" color="light-blue" className="rounded-full bg-light-blue-50 hover:bg-light-blue-100">
                                            <FiTwitter className="w-5 h-5" />
                                        </IconButton>
                                    </a>
                                )}
                                {artist.socialMedia.youtube && (
                                    <a href={artist.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                                        <IconButton variant="text" color="red" className="rounded-full bg-red-50 hover:bg-red-100">
                                            <FiYoutube className="w-5 h-5" />
                                        </IconButton>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default React.memo(ArtistView);
