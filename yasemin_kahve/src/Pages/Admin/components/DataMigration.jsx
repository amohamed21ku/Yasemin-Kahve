import React, { useState } from 'react';
import { useTranslation } from '../../../useTranslation';
import { Database, Upload, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { runFullMigration, clearAllData } from '../../../utils/migrateData';
import './DataMigration.css';

const DataMigration = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleMigration = async () => {
    setIsLoading(true);
    setStatus('');
    setError('');

    try {
      setStatus('Starting migration...');
      const result = await runFullMigration();
      
      setStatus(`Migration completed successfully! Created ${result.categories.length} categories and ${result.products.length} products.`);
    } catch (error) {
      console.error('Migration error:', error);
      setError(`Migration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm(t('confirmClearAllData') || 'Are you sure you want to delete ALL products and categories? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setStatus('');
    setError('');

    try {
      setStatus('Clearing all data...');
      await clearAllData();
      setStatus('All data cleared successfully.');
    } catch (error) {
      console.error('Clear data error:', error);
      setError(`Failed to clear data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-migration">
      <div className="migration-header">
        <Database size={32} />
        <div>
          <h2>{t('dataMigration') || 'Data Migration'}</h2>
          <p>{t('migrationDescription') || 'Import sample products and categories into Firebase'}</p>
        </div>
      </div>

      <div className="migration-cards">
        <div className="migration-card">
          <div className="card-header">
            <Upload size={24} />
            <h3>{t('migrateData') || 'Migrate Sample Data'}</h3>
          </div>
          <p>
            {t('migrateDataDesc') || 'This will create sample categories and products in your Firebase database. Use this if you\'re setting up the system for the first time.'}
          </p>
          <button
            onClick={handleMigration}
            disabled={isLoading}
            className="migrate-btn"
          >
            {isLoading ? (
              <div className="loading-content">
                <div className="migration-spinner"></div>
                {t('migrating') || 'Migrating...'}
              </div>
            ) : (
              <>
                <Upload size={18} />
                {t('runMigration') || 'Run Migration'}
              </>
            )}
          </button>
        </div>

        <div className="migration-card danger">
          <div className="card-header">
            <Trash2 size={24} />
            <h3>{t('clearAllData') || 'Clear All Data'}</h3>
          </div>
          <p>
            {t('clearDataDesc') || 'This will permanently delete all products and categories from your Firebase database. Use with extreme caution.'}
          </p>
          <button
            onClick={handleClearData}
            disabled={isLoading}
            className="clear-btn"
          >
            {isLoading ? (
              <div className="loading-content">
                <div className="migration-spinner"></div>
                {t('clearing') || 'Clearing...'}
              </div>
            ) : (
              <>
                <Trash2 size={18} />
                {t('clearData') || 'Clear All Data'}
              </>
            )}
          </button>
        </div>
      </div>

      {status && (
        <div className="status-message success">
          <CheckCircle size={20} />
          {status}
        </div>
      )}

      {error && (
        <div className="status-message error">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      <div className="migration-info">
        <h4>{t('migrationInfo') || 'Migration Information'}</h4>
        <ul>
          <li>{t('migrationInfo1') || 'The migration will create 8 product categories with multilingual names'}</li>
          <li>{t('migrationInfo2') || 'Sample products will be created with proper category assignments'}</li>
          <li>{t('migrationInfo3') || 'All products will be set as visible by default'}</li>
          <li>{t('migrationInfo4') || 'You can run the migration multiple times safely'}</li>
          <li>{t('migrationInfo5') || 'Use "Clear All Data" only when you want to start fresh'}</li>
        </ul>
      </div>
    </div>
  );
};

export default DataMigration;