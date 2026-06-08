// ============================================================
// CONFIGURACIÓN
// ============================================================

var ALLOWED_GROUP_EMAIL = 'consultas.buc@itti.digital';

// Nombres de las hojas en el Google Sheet vinculado
var SHEET_ALIADOS  = 'Aliados';
var SHEET_DEUDAS   = 'Deudas';
var SHEET_CUOTAS   = 'Cuotas';
var SHEET_PAGOS    = 'Pagos';

// Headers de cada hoja (orden exacto = orden de columnas)
var HEADERS_ALIADOS = ['aliado_id', 'nombre_aliado', 'ruc', 'estado'];

var HEADERS_DEUDAS = [
  'deuda_id', 'aliado_id', 'tipo_pago',
  'monto_total_deuda', 'monto_total_pagado', 'saldo_pendiente',
  'estado_deuda', 'fecha_compromiso', 'fecha_pago', 'observaciones',
  'cantidad_cuotas', 'bolsa', 'brand', 'ruc', 'periodo', 'num_factura', 'servicio'
];

var HEADERS_CUOTAS = [
  'cuota_id', 'deuda_id', 'numero_cuota',
  'monto_cuota', 'fecha_vencimiento', 'estado_cuota', 'monto_pagado'
];

var HEADERS_PAGOS = [
  'pago_id', 'aliado_id', 'deuda_id', 'cuota_id',
  'fecha_pago', 'monto_pagado', 'medio_pago', 'comprobante', 'comentario'
];

// ============================================================
// MOCK (demo cuando las hojas están vacías)
// ============================================================

var MOCK_ALIADOS_DATA = [
  { aliado_id: 'A-001', nombre_aliado: 'Maxifarma Encarnacion', ruc: '80012345-1', estado: 'activo' },
  { aliado_id: 'A-002', nombre_aliado: 'Bacon',                 ruc: '80023456-2', estado: 'activo' },
  { aliado_id: 'A-003', nombre_aliado: 'Starbucks',             ruc: '80034567-3', estado: 'activo' },
  { aliado_id: 'A-004', nombre_aliado: 'Burguer King',          ruc: '80045678-4', estado: 'activo' },
  { aliado_id: 'A-005', nombre_aliado: 'Pizza Hut',             ruc: '80056789-5', estado: 'activo' },
  { aliado_id: 'A-006', nombre_aliado: 'Don Vito',              ruc: '80067890-6', estado: 'activo' },
  { aliado_id: 'A-007', nombre_aliado: 'Lomy',                  ruc: '80078901-7', estado: 'activo' }
];

var MOCK_DEUDAS_DATA = [
  {
    aliado_id: 'A-001', bolsa: 'FARMACIAS', brand: 'MAXIFARMA ENCARNACION',
    cantidad_cuotas: 3, deuda_id: 'D-1001', estado_deuda: 'parcial',
    fecha_compromiso: '2026-04-12', fecha_pago: '', monto_total_deuda: 4500000,
    monto_total_pagado: 1500000, num_factura: 'FAC-0042', observaciones: 'Plan especial de abril.',
    periodo: 'Abril 2026', ruc: '80012345-1', saldo_pendiente: 3000000,
    servicio: 'Publicidad digital', tipo_pago: 'cuotas'
  },
  {
    aliado_id: 'A-001', bolsa: 'FARMACIAS', brand: 'MAXIFARMA ENCARNACION',
    cantidad_cuotas: 1, deuda_id: 'D-1007', estado_deuda: 'pagado',
    fecha_compromiso: '2026-03-01', fecha_pago: '2026-03-31', monto_total_deuda: 800000,
    monto_total_pagado: 800000, num_factura: 'FAC-0031', observaciones: 'Servicio de marzo cancelado.',
    periodo: 'Marzo 2026', ruc: '80012345-1', saldo_pendiente: 0,
    servicio: 'Publicidad digital', tipo_pago: 'unico'
  },
  {
    aliado_id: 'A-002', bolsa: 'GASTRONOMIA', brand: 'BACON',
    cantidad_cuotas: 2, deuda_id: 'D-1002', estado_deuda: 'pendiente',
    fecha_compromiso: '2026-05-05', fecha_pago: '', monto_total_deuda: 1800000,
    monto_total_pagado: 0, num_factura: 'FAC-0058', observaciones: 'Pendiente de primer pago.',
    periodo: 'Mayo 2026', ruc: '80023456-2', saldo_pendiente: 1800000,
    servicio: 'Publicidad digital', tipo_pago: 'cuotas'
  },
  {
    aliado_id: 'A-003', bolsa: 'LUNES DE STARBUCKS', brand: 'STARBUCKS',
    cantidad_cuotas: 1, deuda_id: 'D-1003', estado_deuda: 'pendiente',
    fecha_compromiso: '2026-05-20', fecha_pago: '2026-06-30', monto_total_deuda: 2200000,
    monto_total_pagado: 0, num_factura: 'FAC-0071', observaciones: 'Pago unico acordado.',
    periodo: 'Mayo 2026', ruc: '80034567-3', saldo_pendiente: 2200000,
    servicio: 'Publicidad digital', tipo_pago: 'unico'
  },
  {
    aliado_id: 'A-004', bolsa: 'MARTES DE BURGUER KING', brand: 'BURGUER KING',
    cantidad_cuotas: 4, deuda_id: 'D-1004', estado_deuda: 'parcial',
    fecha_compromiso: '2026-03-15', fecha_pago: '', monto_total_deuda: 6000000,
    monto_total_pagado: 3000000, num_factura: 'FAC-0085', observaciones: 'Acuerdo trimestral. Mitad abonada.',
    periodo: 'Marzo-Junio 2026', ruc: '80045678-4', saldo_pendiente: 3000000,
    servicio: 'Publicidad digital', tipo_pago: 'cuotas'
  },
  {
    aliado_id: 'A-005', bolsa: 'MIERCOLES DE PIZZA HUT', brand: 'PIZZA HUT',
    cantidad_cuotas: 3, deuda_id: 'D-1005', estado_deuda: 'pendiente',
    fecha_compromiso: '2026-06-01', fecha_pago: '', monto_total_deuda: 9000000,
    monto_total_pagado: 0, num_factura: 'FAC-0099', observaciones: 'Primer acuerdo del aliado. Sin pagos aun.',
    periodo: 'Junio 2026', ruc: '80056789-5', saldo_pendiente: 9000000,
    servicio: 'Publicidad digital', tipo_pago: 'cuotas'
  },
  {
    aliado_id: 'A-006', bolsa: 'JUEVES DE DON VITO', brand: 'DON VITO',
    cantidad_cuotas: 2, deuda_id: 'D-1006', estado_deuda: 'pendiente',
    fecha_compromiso: '2026-05-01', fecha_pago: '', monto_total_deuda: 3500000,
    monto_total_pagado: 0, num_factura: 'FAC-0022', observaciones: 'Acuerdo reciente. Sin pagos registrados.',
    periodo: 'Mayo 2026', ruc: '80067890-6', saldo_pendiente: 3500000,
    servicio: 'Publicidad digital', tipo_pago: 'cuotas'
  },
  {
    aliado_id: 'A-007', bolsa: 'VIERNES DE LOMY', brand: 'LOMY',
    cantidad_cuotas: 2, deuda_id: 'D-1008', estado_deuda: 'parcial',
    fecha_compromiso: '2026-04-01', fecha_pago: '', monto_total_deuda: 2600000,
    monto_total_pagado: 600000, num_factura: 'FAC-0110', observaciones: 'Primera cuota abonada parcialmente.',
    periodo: 'Abril-Mayo 2026', ruc: '80078901-7', saldo_pendiente: 2000000,
    servicio: 'Publicidad digital', tipo_pago: 'cuotas'
  }
];

var MOCK_CUOTAS_DATA = [
  { cuota_id: 'C-2001', deuda_id: 'D-1001', estado_cuota: 'pagada',   fecha_vencimiento: '2026-05-01', monto_cuota: 1500000, monto_pagado: 1500000, numero_cuota: 1 },
  { cuota_id: 'C-2002', deuda_id: 'D-1001', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-01', monto_cuota: 1500000, monto_pagado: 0,       numero_cuota: 2 },
  { cuota_id: 'C-2003', deuda_id: 'D-1001', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-01', monto_cuota: 1500000, monto_pagado: 0,       numero_cuota: 3 },
  { cuota_id: 'C-2011', deuda_id: 'D-1007', estado_cuota: 'pagada',   fecha_vencimiento: '2026-03-31', monto_cuota: 800000,  monto_pagado: 800000,  numero_cuota: 1 },
  { cuota_id: 'C-2004', deuda_id: 'D-1002', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-15', monto_cuota: 900000,  monto_pagado: 0,       numero_cuota: 1 },
  { cuota_id: 'C-2005', deuda_id: 'D-1002', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-15', monto_cuota: 900000,  monto_pagado: 0,       numero_cuota: 2 },
  { cuota_id: 'C-2006', deuda_id: 'D-1003', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-30', monto_cuota: 2200000, monto_pagado: 0,       numero_cuota: 1 },
  { cuota_id: 'C-2007', deuda_id: 'D-1004', estado_cuota: 'pagada',   fecha_vencimiento: '2026-04-01', monto_cuota: 1500000, monto_pagado: 1500000, numero_cuota: 1 },
  { cuota_id: 'C-2008', deuda_id: 'D-1004', estado_cuota: 'pagada',   fecha_vencimiento: '2026-05-01', monto_cuota: 1500000, monto_pagado: 1500000, numero_cuota: 2 },
  { cuota_id: 'C-2009', deuda_id: 'D-1004', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-01', monto_cuota: 1500000, monto_pagado: 0,       numero_cuota: 3 },
  { cuota_id: 'C-2010', deuda_id: 'D-1004', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-01', monto_cuota: 1500000, monto_pagado: 0,       numero_cuota: 4 },
  { cuota_id: 'C-2012', deuda_id: 'D-1005', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-01', monto_cuota: 3000000, monto_pagado: 0,       numero_cuota: 1 },
  { cuota_id: 'C-2013', deuda_id: 'D-1005', estado_cuota: 'pendiente', fecha_vencimiento: '2026-08-01', monto_cuota: 3000000, monto_pagado: 0,       numero_cuota: 2 },
  { cuota_id: 'C-2014', deuda_id: 'D-1005', estado_cuota: 'pendiente', fecha_vencimiento: '2026-09-01', monto_cuota: 3000000, monto_pagado: 0,       numero_cuota: 3 },
  { cuota_id: 'C-2015', deuda_id: 'D-1006', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-15', monto_cuota: 1750000, monto_pagado: 0,       numero_cuota: 1 },
  { cuota_id: 'C-2016', deuda_id: 'D-1006', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-15', monto_cuota: 1750000, monto_pagado: 0,       numero_cuota: 2 },
  { cuota_id: 'C-2017', deuda_id: 'D-1008', estado_cuota: 'parcial',   fecha_vencimiento: '2026-05-01', monto_cuota: 1300000, monto_pagado: 600000,  numero_cuota: 1 },
  { cuota_id: 'C-2018', deuda_id: 'D-1008', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-01', monto_cuota: 1300000, monto_pagado: 0,       numero_cuota: 2 }
];

var MOCK_PAGOS_DATA = [
  {
    aliado_id: 'A-001', comentario: 'Pago inicial confirmado por tesoreria.',
    comprobante: 'TRX-15001', cuota_id: 'C-2001', deuda_id: 'D-1001',
    fecha_pago: '2026-05-01', medio_pago: 'Transferencia', monto_pagado: 1500000,
    pago_id: 'P-3001'
  }
];

// ============================================================
// HELPERS DE SHEETS
// ============================================================

function getSpreadsheet_() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    return null;
  }
}

function getOrCreateSheet_(name, headers) {
  var ss = getSpreadsheet_();
  if (!ss) return null;

  var sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#d1fae5');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/** Convierte filas de un sheet en array de objetos usando la primera fila como keys */
function sheetToObjects_(sheet) {
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  return data.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(header, i) {
      var val = row[i];
      obj[header] = val instanceof Date
        ? Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd')
        : val;
    });
    return obj;
  });
}

/** Agrega una fila al sheet usando el orden de headers */
function appendRow_(sheet, headers, obj) {
  if (!sheet) return;
  var row = headers.map(function(h) { return obj[h] !== undefined ? obj[h] : ''; });
  sheet.appendRow(row);
}

/** Actualiza una fila buscando por un campo clave */
function updateRow_(sheet, headers, keyField, keyValue, updates) {
  if (!sheet) return false;
  var data = sheet.getDataRange().getValues();
  var keyIndex = headers.indexOf(keyField);
  if (keyIndex === -1) return false;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][keyIndex]) === String(keyValue)) {
      Object.keys(updates).forEach(function(field) {
        var colIndex = headers.indexOf(field);
        if (colIndex !== -1) {
          sheet.getRange(i + 1, colIndex + 1).setValue(updates[field]);
        }
      });
      return true;
    }
  }
  return false;
}

function generateId_(prefix) {
  return prefix + '-' + Date.now();
}

// ============================================================
// LECTORES DE DATOS
// ============================================================

function getAliadosData_() {
  var sheet = getOrCreateSheet_(SHEET_ALIADOS, HEADERS_ALIADOS);
  var rows = sheetToObjects_(sheet);
  return rows.length > 0 ? rows : MOCK_ALIADOS_DATA;
}

function getDeudasData_(aliadoId) {
  var sheet = getOrCreateSheet_(SHEET_DEUDAS, HEADERS_DEUDAS);
  var rows = sheetToObjects_(sheet);
  var allDeudas = rows.length > 0 ? rows : MOCK_DEUDAS_DATA;

  if (aliadoId) {
    return allDeudas.filter(function(d) {
      return String(d.aliado_id) === String(aliadoId);
    });
  }
  return allDeudas;
}

function getCuotasData_(deudaIds) {
  var sheet = getOrCreateSheet_(SHEET_CUOTAS, HEADERS_CUOTAS);
  var rows = sheetToObjects_(sheet);
  var allCuotas = rows.length > 0 ? rows : MOCK_CUOTAS_DATA;

  if (deudaIds && deudaIds.length > 0) {
    return allCuotas.filter(function(c) {
      return deudaIds.indexOf(String(c.deuda_id)) !== -1;
    });
  }
  return allCuotas;
}

function getPagosData_(aliadoId) {
  var sheet = getOrCreateSheet_(SHEET_PAGOS, HEADERS_PAGOS);
  var rows = sheetToObjects_(sheet);
  var allPagos = rows.length > 0 ? rows : MOCK_PAGOS_DATA;

  if (aliadoId) {
    return allPagos.filter(function(p) {
      return String(p.aliado_id) === String(aliadoId);
    });
  }
  return allPagos;
}

// ============================================================
// HELPERS DE NEGOCIO
// ============================================================

function computeResumen_(deudas) {
  return {
    deuda_total: deudas.reduce(function(s, d) { return s + Number(d.monto_total_deuda || 0); }, 0),
    monto_total_pagado: deudas.reduce(function(s, d) { return s + Number(d.monto_total_pagado || 0); }, 0),
    saldo_pendiente: deudas.reduce(function(s, d) { return s + Number(d.saldo_pendiente || 0); }, 0)
  };
}

function computeEstadoGeneral_(saldo, total) {
  if (total <= 0)     return 'sin_deuda';
  if (saldo <= 0)     return 'pagado';
  if (saldo < total)  return 'parcial';
  return 'pendiente';
}

function buildAllySummary_(aliado, deudas) {
  var resumen = computeResumen_(deudas);
  var activa = deudas.filter(function(d) { return d.estado_deuda !== 'pagado'; })[0] || deudas[0];
  return {
    aliado_id:          aliado.aliado_id,
    bolsa:              activa ? (activa.bolsa  || '') : '',
    brand:              activa ? (activa.brand  || '') : '',
    deuda_total:        resumen.deuda_total,
    estado:             aliado.estado,
    estado_general:     computeEstadoGeneral_(resumen.saldo_pendiente, resumen.deuda_total),
    monto_total_pagado: resumen.monto_total_pagado,
    nombre_aliado:      aliado.nombre_aliado,
    ruc:                activa ? (activa.ruc    || '') : '',
    saldo_pendiente:    resumen.saldo_pendiente,
    ultimo_periodo:     activa ? (activa.periodo || '') : ''
  };
}

// ============================================================
// FUNCIONES PÚBLICAS (llamadas desde el frontend)
// ============================================================

function doGet() {
  if (!userCanAccess_()) {
    return HtmlService.createHtmlOutputFromFile('AccessDenied')
      .setTitle('Acceso restringido')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Loyalty Pagos')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename).getRawContent();
}

function getClientBundle() {
  var source = HtmlService.createTemplateFromFile('AppBundle').getRawContent();
  return String(source)
    .replace(/^\s*<script[^>]*>/i, '')
    .replace(/<\/script>\s*$/i, '');
}

function getClientStyles() {
  var source = HtmlService.createTemplateFromFile('AppStyles').getRawContent();
  return String(source)
    .replace(/^\s*<style[^>]*>/i, '')
    .replace(/<\/style>\s*$/i, '');
}

function getSessionContext() {
  var email = Session.getActiveUser().getEmail();

  if (!email) {
    throw new Error('Iniciá sesión con tu cuenta corporativa para continuar.');
  }

  if (!userCanAccess_()) {
    throw new Error('Tu cuenta no está autorizada para acceder a este panel.');
  }

  return {
    email: email,
    id: email,
    name: buildDisplayName_(email),
    role: 'Alianzas'
  };
}

function listarAliados() {
  var aliados = getAliadosData_();
  return aliados.map(function(aliado) {
    var deudas = getDeudasData_(aliado.aliado_id);
    return buildAllySummary_(aliado, deudas);
  });
}

function obtenerDetalleAliado(aliadoId) {
  var aliados = getAliadosData_();
  var aliado = aliados.find(function(a) {
    return String(a.aliado_id) === String(aliadoId);
  });

  if (!aliado) throw new Error('No encontramos ese aliado.');

  var deudas  = getDeudasData_(aliadoId);
  var deudaIds = deudas.map(function(d) { return String(d.deuda_id); });
  var cuotas  = getCuotasData_(deudaIds);
  var pagos   = getPagosData_(aliadoId);
  var resumen = computeResumen_(deudas);

  return {
    aliado:  { aliado_id: aliado.aliado_id, estado: aliado.estado, nombre_aliado: aliado.nombre_aliado },
    cuotas:  cuotas,
    deudas:  deudas,
    pagos:   pagos,
    resumen: resumen
  };
}

/**
 * Crea un nuevo acuerdo de pago (cuotas) y lo persiste en el Google Sheet.
 *
 * @param {Object} payload
 * @param {string} payload.aliadoId
 * @param {number} payload.montoTotal
 * @param {string} payload.fechaCompromiso
 * @param {Array}  payload.cuotas            - lista de cuotas { numero_cuota, monto_cuota, fecha_pago }
 * @param {string} [payload.observaciones]
 * @param {string} [payload.brand]
 * @param {string} [payload.ruc]
 * @param {string} [payload.periodo]
 * @param {string} [payload.numFactura]
 * @param {string} [payload.servicio]
 */
function crearAcuerdo(payload) {
  if (!payload || !payload.aliadoId) {
    throw new Error('Faltan datos obligatorios para crear el acuerdo.');
  }

  if (!payload.montoTotal || Number(payload.montoTotal) <= 0) {
    throw new Error('El monto total debe ser mayor a cero.');
  }

  if (!payload.fechaCompromiso) {
    throw new Error('La fecha de compromiso es obligatoria.');
  }

  if (!payload.cuotas || payload.cuotas.length === 0) {
    throw new Error('Debés agregar al menos una cuota.');
  }

  var cuotaInvalida = payload.cuotas.some(function(c) {
    return !c.monto_cuota || !c.fecha_pago;
  });
  if (cuotaInvalida) {
    throw new Error('Todas las cuotas deben tener monto y fecha de pago.');
  }

  var tipoPago = payload.cuotas.length === 1 ? 'unico' : 'cuotas';
  var deudaId = generateId_('D');
  var cantidadCuotas = payload.cuotas.length;

  // Escribir en hoja Deudas (si hay spreadsheet vinculado)
  var sheetDeudas = getOrCreateSheet_(SHEET_DEUDAS, HEADERS_DEUDAS);
  appendRow_(sheetDeudas, HEADERS_DEUDAS, {
    aliado_id:          payload.aliadoId,
    bolsa:              payload.bolsa || '',
    brand:              payload.brand || '',
    cantidad_cuotas:    cantidadCuotas,
    deuda_id:           deudaId,
    estado_deuda:       'pendiente',
    fecha_compromiso:   payload.fechaCompromiso,
    fecha_pago:         tipoPago === 'unico' ? (payload.cuotas[0].fecha_pago || '') : '',
    monto_total_deuda:  Number(payload.montoTotal),
    monto_total_pagado: 0,
    num_factura:        payload.numFactura || '',
    observaciones:      payload.observaciones || '',
    periodo:            payload.periodo || '',
    ruc:                payload.ruc || '',
    saldo_pendiente:    Number(payload.montoTotal),
    servicio:           payload.servicio || '',
    tipo_pago:          tipoPago
  });

  // Escribir cuotas en hoja Cuotas (si hay spreadsheet vinculado)
  var sheetCuotas = getOrCreateSheet_(SHEET_CUOTAS, HEADERS_CUOTAS);
  payload.cuotas.forEach(function(cuota) {
    appendRow_(sheetCuotas, HEADERS_CUOTAS, {
      cuota_id:         generateId_('C'),
      deuda_id:         deudaId,
      estado_cuota:     'pendiente',
      fecha_vencimiento: cuota.fecha_pago,
      monto_cuota:      Number(cuota.monto_cuota),
      monto_pagado:     0,
      numero_cuota:     cuota.numero_cuota
    });
  });

  return { deudaId: deudaId, ok: true };
}

/**
 * Agrega una cuota extra a una deuda existente.
 *
 * @param {Object} payload
 * @param {string} payload.deudaId
 * @param {number} payload.monto_cuota
 * @param {string} payload.fecha_pago
 */
function agregarCuota(payload) {
  if (!payload || !payload.deudaId || !payload.monto_cuota || !payload.fecha_pago) {
    throw new Error('Faltan datos para agregar la cuota.');
  }

  var monto = Number(payload.monto_cuota);
  if (monto <= 0) throw new Error('El monto de la cuota debe ser mayor a cero.');

  // Obtener número siguiente de cuota
  var sheetCuotas = getOrCreateSheet_(SHEET_CUOTAS, HEADERS_CUOTAS);
  var cuotasExistentes = sheetToObjects_(sheetCuotas).filter(function(c) {
    return String(c.deuda_id) === String(payload.deudaId);
  });
  var nextNumero = cuotasExistentes.length + 1;

  var cuotaId = generateId_('C');
  appendRow_(sheetCuotas, HEADERS_CUOTAS, {
    cuota_id:          cuotaId,
    deuda_id:          payload.deudaId,
    estado_cuota:      'pendiente',
    fecha_vencimiento: payload.fecha_pago,
    monto_cuota:       monto,
    monto_pagado:      0,
    numero_cuota:      nextNumero
  });

  // Actualizar totales en Deudas
  var sheetDeudas = getOrCreateSheet_(SHEET_DEUDAS, HEADERS_DEUDAS);
  var deudas = sheetToObjects_(sheetDeudas);
  var deuda = deudas.find(function(d) { return String(d.deuda_id) === String(payload.deudaId); });
  if (deuda) {
    updateRow_(sheetDeudas, HEADERS_DEUDAS, 'deuda_id', payload.deudaId, {
      cantidad_cuotas:   nextNumero,
      monto_total_deuda: Number(deuda.monto_total_deuda || 0) + monto,
      saldo_pendiente:   Number(deuda.saldo_pendiente   || 0) + monto,
      tipo_pago:         'cuotas'
    });
  }

  return { cuotaId: cuotaId, ok: true };
}

/**
 * Registra un pago real contra una deuda/cuota existente.
 */
function registrarPago(payload) {
  if (!payload || !payload.aliadoId || !payload.deudaId) {
    throw new Error('Faltan datos para registrar el pago.');
  }

  if (!payload.montoPagado || Number(payload.montoPagado) <= 0) {
    throw new Error('El monto pagado debe ser mayor a cero.');
  }

  var monto = Number(payload.montoPagado);
  var pagoId = generateId_('P');

  // Escribir en hoja Pagos (si hay spreadsheet vinculado)
  var sheetPagos = getOrCreateSheet_(SHEET_PAGOS, HEADERS_PAGOS);
  appendRow_(sheetPagos, HEADERS_PAGOS, {
    aliado_id:   payload.aliadoId,
    comentario:  payload.comentario || '',
    comprobante: payload.comprobante || '',
    cuota_id:    payload.cuotaId || '',
    deuda_id:    payload.deudaId,
    fecha_pago:  payload.fechaPago,
    medio_pago:  payload.medioPago || '',
    monto_pagado: monto,
    pago_id:     pagoId
  });

  // Actualizar saldo en hoja Deudas (si hay spreadsheet vinculado)
  var sheetDeudas = getOrCreateSheet_(SHEET_DEUDAS, HEADERS_DEUDAS);
  var deudas = sheetToObjects_(sheetDeudas);
  var deuda = deudas.find(function(d) { return String(d.deuda_id) === String(payload.deudaId); });

  if (deuda) {
    var nuevoTotalPagado = Number(deuda.monto_total_pagado || 0) + monto;
    var nuevoSaldo = Math.max(0, Number(deuda.saldo_pendiente || 0) - monto);
    var nuevoEstado = nuevoSaldo <= 0 ? 'pagado' : nuevoTotalPagado > 0 ? 'parcial' : 'pendiente';

    updateRow_(sheetDeudas, HEADERS_DEUDAS, 'deuda_id', payload.deudaId, {
      estado_deuda:       nuevoEstado,
      monto_total_pagado: nuevoTotalPagado,
      saldo_pendiente:    nuevoSaldo
    });
  }

  // Actualizar cuota si aplica (si hay spreadsheet vinculado)
  if (payload.cuotaId) {
    var sheetCuotas = getOrCreateSheet_(SHEET_CUOTAS, HEADERS_CUOTAS);
    var cuotas = sheetToObjects_(sheetCuotas);
    var cuota = cuotas.find(function(c) { return String(c.cuota_id) === String(payload.cuotaId); });

    if (cuota) {
      var nuevoMontoPagadoCuota = Number(cuota.monto_pagado || 0) + monto;
      var nuevoEstadoCuota = nuevoMontoPagadoCuota >= Number(cuota.monto_cuota) ? 'pagada' : 'parcial';

      updateRow_(sheetCuotas, HEADERS_CUOTAS, 'cuota_id', payload.cuotaId, {
        estado_cuota: nuevoEstadoCuota,
        monto_pagado: nuevoMontoPagadoCuota
      });
    }
  }

  return { ok: true, pagoId: pagoId };
}

// ============================================================
// AUTENTICACIÓN
// ============================================================

function userCanAccess_() {
  var emailUsuario = Session.getActiveUser().getEmail();
  if (!emailUsuario) return false;

  try {
    var grupo = GroupsApp.getGroupByEmail(ALLOWED_GROUP_EMAIL);
    if (grupo && grupo.hasUser(emailUsuario)) return true;
  } catch (e) {}

  return emailUsuario === Session.getEffectiveUser().getEmail();
}

function buildDisplayName_(email) {
  if (!email) return 'Usuario';
  var local = email.split('@')[0];
  return local
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}
