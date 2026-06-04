import { MapPin, Edit, Trash2, Check } from 'lucide-react';

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  type?: 'home' | 'work' | 'other';
}

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false,
  showActions = true
}: AddressCardProps) {
  const typeLabels = {
    home: 'Home',
    work: 'Work',
    other: 'Other'
  };

  return (
    <div
      className={`bg-card border-2 rounded-lg p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
      onClick={() => onSelect?.(address.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{address.name}</h3>
              {address.type && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  {typeLabels[address.type]}
                </span>
              )}
              {address.isDefault && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{address.phone}</p>
          </div>
        </div>

        {isSelected && (
          <div className="bg-primary text-primary-foreground rounded-full p-1">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Address */}
      <div className="text-sm text-foreground mb-3">
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} - {address.pincode}
        </p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id);
              }}
              className="text-sm text-danger hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
