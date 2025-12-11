import React from 'react';
import { Box, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface Filter {
  id: string;
  label: string;
}

interface FilterChipsProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        mb: 3,
        flexWrap: 'wrap',
      }}
    >
      {filters.map((filter) => {
        const isActive = filter.id === activeFilter;
        return (
          <Chip
            key={filter.id}
            label={filter.label}
            icon={isActive ? <CheckIcon /> : undefined}
            onClick={() => onFilterChange(filter.id)}
            sx={{
              backgroundColor: isActive ? '#6B46C1' : '#FFFFFF',
              color: isActive ? '#FFFFFF' : '#2C2C2C',
              fontWeight: isActive ? 600 : 500,
              border: '1px solid',
              borderColor: isActive ? '#6B46C1' : '#E0E0E0',
              px: 2,
              py: 2.5,
              height: 'auto',
              fontSize: '0.95rem',
              '&:hover': {
                backgroundColor: isActive ? '#5A38A3' : '#F5F3FA',
                borderColor: '#6B46C1',
              },
              '& .MuiChip-icon': {
                color: '#FFFFFF',
                marginLeft: '4px',
              },
            }}
          />
        );
      })}
    </Box>
  );
};

export default FilterChips;
