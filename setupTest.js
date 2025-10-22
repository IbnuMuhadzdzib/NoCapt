import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest'; // penting biar binding-nya ke vitest langsung

expect.extend(matchers);
