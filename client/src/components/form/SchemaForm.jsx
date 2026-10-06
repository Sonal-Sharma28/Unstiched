import React, { useMemo } from 'react';
import { FieldRenderer } from './FieldRenderer';
import { Card } from '../ui/Card';

export function SchemaForm({ schema, values, errors, onChange, onBlur, disabled }) {
  const groupedFields = useMemo(() => {
    if (!schema) return [];
    
    // Check if schema is array or object
    let schemaArray = Array.isArray(schema) ? schema : [];
    if (!Array.isArray(schema)) {
       // If it has properties, it's JSON Schema-like. If not, it's our direct object map.
       const schemaMap = schema.properties || schema;
       schemaArray = Object.entries(schemaMap).map(([key, val]) => ({ id: key, ...val }));
    }

    const groupsMap = new Map();
    schemaArray.forEach(field => {
      const g = field.group || 'General';
      if (!groupsMap.has(g)) {
        groupsMap.set(g, []);
      }
      groupsMap.get(g).push(field);
    });

    // Sort fields within groups by order
    const groupsArr = [];
    for (const [name, fields] of groupsMap.entries()) {
      fields.sort((a, b) => (a.order || 0) - (b.order || 0));
      // Group order determined by smallest field order
      const minOrder = Math.min(...fields.map(f => f.order || 0));
      groupsArr.push({ name, fields, minOrder });
    }

    groupsArr.sort((a, b) => a.minOrder - b.minOrder);
    return groupsArr;
  }, [schema]);

  if (!schema) return null;

  return (
    <div className="space-y-6 md:space-y-8">
      {groupedFields.map(group => (
        <Card key={group.name} className="p-4 sm:p-6 md:p-8">
          <h3 className="font-display text-xl md:text-2xl font-medium mb-6 text-ink capitalize">
            {group.name}
          </h3>
          <div className="space-y-6">
            {group.fields.map(field => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={values?.[field.id]}
                error={errors?.[field.id]}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
