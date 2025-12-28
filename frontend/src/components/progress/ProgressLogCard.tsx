import { Calendar, Award, Edit, Trash2 } from 'lucide-react';
import type { ProgressLog } from '../../types/progress';
import { Link } from 'react-router-dom';

interface ProgressLogCardProps {
  log: ProgressLog;
  onDelete?: (id: number) => void;
}

const ProgressLogCard = ({ log, onDelete }: ProgressLogCardProps) => {
  return (
    <div className="card-talkie p-6">
      <div className="flex items-start justify-between mb-4">
        <span className="bg-teal-gradient text-white text-xs font-bold px-3 py-1.5 rounded-pill shadow-soft">
          {log.category_display_name}
        </span>
        <div className="flex items-center gap-2">
          <Link to={`/progress/log/${log.id}`}>
            <button className="p-2 text-warmgray-600 hover:text-teal transition-colors">
              <Edit className="h-4 w-4" />
            </button>
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(log.id)}
              className="p-2 text-warmgray-600 hover:text-coral transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-warmgray-600 mb-3">
        <Calendar className="h-4 w-4" />
        <span>{new Date(log.log_date).toLocaleDateString()}</span>
        <span>•</span>
        <span>{log.age_display}</span>
      </div>

      {log.notes && (
        <p className="text-warmgray-700 mb-4">{log.notes}</p>
      )}

      {log.achievements && log.achievements.length > 0 && (
        <div className="mb-4">
          <h4 className="flex items-center gap-2 font-semibold text-sm text-warmgray-800 mb-2">
            <Award className="h-4 w-4 text-sunshine" />
            Achievements
          </h4>
          <ul className="space-y-1">
            {log.achievements.map((achievement, index) => (
              <li key={index} className="text-sm text-warmgray-600 flex items-start gap-2">
                <span className="text-sunshine mt-1">✓</span>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {log.milestone && (
        <div className="mt-3 pt-3 border-t border-warmgray-200">
          <span className="text-xs text-warmgray-600">Related Milestone:</span>
          <p className="text-sm font-semibold text-teal">{log.milestone.title}</p>
        </div>
      )}
    </div>
  );
};

export default ProgressLogCard;
