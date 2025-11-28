'use client'

import { Trophy, Award, Star } from 'lucide-react'
import { Certification, Badge, getEarnedCertifications, getEarnedBadges, getHighestCertification } from '@/lib/utils/sustainabilityCertifications'
import { SustainabilityMetrics } from '@/lib/utils/sustainabilityCertifications'

interface CertificationsBadgesProps {
  metrics: SustainabilityMetrics
}

export default function CertificationsBadges({ metrics }: CertificationsBadgesProps) {
  const earnedCertifications = getEarnedCertifications(metrics)
  const earnedBadges = getEarnedBadges(metrics)
  const highestCert = getHighestCertification(metrics)

  return (
    <div className="space-y-6">
      {/* Highest Certification */}
      {highestCert && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-300">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{highestCert.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">Highest Certification</h3>
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: highestCert.color }}>
                {highestCert.name}
              </h2>
              <p className="text-gray-600">{highestCert.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* All Certifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Certifications ({earnedCertifications.length}/{10})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {earnedCertifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{cert.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{cert.name}</h4>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                  <div className="mt-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      Level {cert.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {earnedCertifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No certifications earned yet. Keep improving your sustainability!</p>
          </div>
        )}
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Badges ({earnedBadges.length}/{10})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{badge.name}</h4>
              <p className="text-xs text-gray-500">{badge.description}</p>
              <div className="mt-2">
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${badge.color}20`,
                    color: badge.color,
                  }}
                >
                  {badge.category}
                </span>
              </div>
            </div>
          ))}
        </div>
        {earnedBadges.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No badges earned yet. Complete challenges to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  )
}

