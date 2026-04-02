// 6G Blockchain System - Main JavaScript

$(document).ready(function() {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Initialize popovers
    $('[data-bs-toggle="popover"]').popover();
    
    // Auto-update dashboard data every 30 seconds
    if (window.location.pathname === '/') {
        setInterval(updateDashboardStats, 30000);
    }

    // Connect WebSocket for real-time updates
    connectWebSocket();
    
    // Node filtering
    $('#nodeFilterForm').on('submit', function(e) {
        e.preventDefault();
        const nodeType = $('#nodeTypeFilter').val();
        const status = $('#statusFilter').val();
        
        let url = window.location.pathname;
        const params = new URLSearchParams();
        
        if (nodeType) params.append('node_type', nodeType);
        if (status) params.append('status', status);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        window.location.href = url;
    });
    
    // Transaction filtering
    $('#txFilterForm').on('submit', function(e) {
        e.preventDefault();
        const txType = $('#txTypeFilter').val();
        const status = $('#statusFilter').val();
        const shard = $('#shardFilter').val();
        
        let url = window.location.pathname;
        const params = new URLSearchParams();
        
        if (txType) params.append('tx_type', txType);
        if (status) params.append('status', status);
        if (shard) params.append('shard', shard);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        window.location.href = url;
    });
    
    // Animate elements on scroll
    $(window).on('scroll', function() {
        $('.animate-on-scroll').each(function() {
            if (isElementInViewport(this)) {
                $(this).addClass('animate-slide');
            }
        });
    });
    
    // Initialize charts
    initializeCharts();
});

function updateDashboardStats() {
    $.ajax({
        url: '/api/dashboard-stats/',
        method: 'GET',
        success: function(data) {
            // Update Main Dashboard
            $('#totalNodes').text(data.total_nodes);
            $('#activeNodes').text(data.active_nodes);
            $('#totalShards').text(data.total_shards);
            $('#pendingTransactions').text(data.pending_transactions);
            $('#confirmedTransactions').text(data.confirmed_transactions);
            $('#failedTransactions').text(data.failed_transactions);
            $('#activeConsensus').text(data.processing_transactions);
            $('#recentTxCount').text(data.recent_tx_count);
            
            // Update Transaction Monitor Page (if on that page)
            $('#totalTxCountDisplay').text(data.total_tx_actual);
            $('#confirmedTxCountDisplay').text(data.confirmed_transactions);
            $('#pendingTxCountDisplay').text(data.pending_transactions);
            $('#processingTxCountDisplay').text(data.processing_transactions);

            // Update with animation
            $('.stat-number').addClass('animate-slide');
            setTimeout(() => {
                $('.stat-number').removeClass('animate-slide');
            }, 300);
        }
    });
}

function connectWebSocket() {
    // single global socket reference to avoid duplicate connections
    if (window.__wsSocket && window.__wsSocket.readyState === WebSocket.OPEN) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/blockchain/`;
    console.debug('Connecting WebSocket to', wsUrl);

    try {
        window.__wsSocket = new WebSocket(wsUrl);
    } catch (err) {
        console.error('WebSocket creation failed', err);
        scheduleReconnect();
        return;
    }

    // simple exponential backoff state
    window.__wsReconnectAttempts = window.__wsReconnectAttempts || 0;

    const socket = window.__wsSocket;

    socket.onopen = function() {
        console.log('WebSocket connected');
        window.__wsReconnectAttempts = 0;
        
        // Update Live Monitoring Badge
        const badge = $('#liveMonitoringStatus');
        const text = $('#liveMonitoringText');
        if (badge.length) {
            badge.removeClass('bg-secondary bg-danger').addClass('bg-success');
            text.text('Live Monitoring (Connected)');
        }
    };

    socket.onmessage = function(e) {
        try {
            const data = JSON.parse(e.data);
            handleWebSocketMessage(data);
        } catch (err) {
            console.warn('Invalid WS message', err, e.data);
        }
    };

    socket.onclose = function(e) {
        console.warn('WebSocket closed', e);
        
        // Update Live Monitoring Badge
        const badge = $('#liveMonitoringStatus');
        const text = $('#liveMonitoringText');
        if (badge.length) {
            badge.removeClass('bg-secondary bg-success').addClass('bg-danger');
            text.text('Disconnected (Reconnecting...)');
        }
        
        scheduleReconnect();
    };

    socket.onerror = function(e) {
        console.error('WebSocket error:', e);
        // errors usually trigger close; let onclose handle reconnect
    };

    function scheduleReconnect() {
        window.__wsReconnectAttempts = (window.__wsReconnectAttempts || 0) + 1;
        const attempt = window.__wsReconnectAttempts;
        // exponential backoff up to 30s
        const delay = Math.min(30000, Math.pow(2, Math.min(attempt, 6)) * 1000) + Math.floor(Math.random() * 1000);
        console.debug('Scheduling WS reconnect in', delay, 'ms (attempt', attempt, ')');
        setTimeout(function() {
            // clear old socket reference before reconnecting
            try { if (window.__wsSocket) window.__wsSocket.close(); } catch (e) {}
            window.__wsSocket = null;
            connectWebSocket();
        }, delay);
    }
}

function handleWebSocketMessage(data) {
    // ignore connection acknowledgement
    if (!data || !data.type || data.type === 'connection_established') return;

    switch(data.type) {
        case 'NEW_TRANSACTION':
            showNotification('New transaction detected', 'success');
            if (window.location.pathname === '/transactions/') location.reload();
            updateDashboardStats(); // Refresh stats immediately
            break;

        case 'TRANSACTION_UPDATE':
            showNotification(`Transaction ${data.data.tx_hash.substring(0, 10)}... confirmed`, 'success');
            if (window.location.pathname === '/transactions/') {
                const txRow = $(`tr[data-tx-hash="${data.data.tx_hash}"]`);
                if (txRow.length) {
                    txRow.find('.status-badge').removeClass('bg-warning bg-primary bg-danger').addClass('bg-success').html('<i class="fas fa-check-circle me-1"></i>Confirmed');
                    txRow.find('.tx-confirmed-at').text(new Date().toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}));
                } else {
                    location.reload();
                }
            }
            updateDashboardStats(); // Refresh stats immediately
            break;

        case 'NODE_UPDATE':
            showNotification(`Node ${data.data.node_id} status updated`, 'info');
            if (window.location.pathname === '/nodes/') refreshNodeList();
            break;

        case 'CONSENSUS_ROUND':
            showNotification(`New consensus round #${data.data.round} started for shard ${data.data.shard}`, 'info');
            if (window.location.pathname === '/consensus/') {
                // If on consensus page, refresh the active rounds list
                if (typeof loadActiveRounds === 'function') {
                    loadActiveRounds();
                } else {
                    location.reload();
                }
            }
            break;

        case 'CONSENSUS_UPDATE':
            // Progress update for rounds
            handleGlobalConsensusUpdate(data.data);
            if (window.location.pathname === '/transactions/') {
                updateDashboardStats(); // Refresh stats to update 'Processing' count
            }
            break;

        case 'SHARD_UPDATE':
            showNotification(`Shard ${data.data.shard_name} configuration updated`, 'info');
            if (window.location.pathname === '/shards/') {
                if (typeof updateShardStats === 'function') {
                    updateShardStats();
                } else {
                    location.reload();
                }
            }
            break;

        default:
            console.debug('Unhandled WS message type', data.type, data);
    }
}

function showNotification(message, type = 'info') {
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    $('#notifications').prepend(alertHtml);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        $('.alert').first().alert('close');
    }, 5000);
}

function initializeCharts() {
    // System Performance Chart
    const ctx = document.getElementById('performanceChart');
    if (ctx) {
        const performanceChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'TPS (Transactions per second)',
                    data: [150, 220, 180, 300, 250, 280],
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Latency (ms)',
                    data: [120, 80, 100, 60, 90, 70],
                    borderColor: '#00cc6a',
                    backgroundColor: 'rgba(0, 204, 106, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#cccccc'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#cccccc'
                        }
                    }
                }
            }
        });
    }
    
    // Shard Distribution Chart
    const shardCtx = document.getElementById('shardDistributionChart');
    if (shardCtx) {
        const shardChart = new Chart(shardCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['URLLC', 'eMBB', 'mIoT', 'MEC'],
                datasets: [{
                    data: [25, 30, 35, 10],
                    backgroundColor: [
                        '#00ff88',
                        '#00cc6a',
                        '#33ffaa',
                        '#66ffbb'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Node Management Functions
function updateNodeStatus(nodeId, status) {
    $.ajax({
        url: `/api/nodes/${nodeId}/status/`,
        method: 'POST',
        data: {
            status: status,
            csrfmiddlewaretoken: getCSRFToken()
        },
        success: function(data) {
            showNotification(`Node status updated to ${status}`, 'success');
            setTimeout(() => location.reload(), 1000);
        },
        error: function(xhr) {
            showNotification('Failed to update node status', 'error');
        }
    });
}

function reassignNode(nodeId, shardId) {
    $.ajax({
        url: `/api/nodes/${nodeId}/reassign/`,
        method: 'POST',
        data: {
            shard_id: shardId,
            csrfmiddlewaretoken: getCSRFToken()
        },
        success: function(data) {
            showNotification('Node reassigned successfully', 'success');
            setTimeout(() => location.reload(), 1000);
        },
        error: function(xhr) {
            showNotification('Failed to reassign node', 'error');
        }
    });
}

function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

// Transaction Functions
function viewTransactionDetails(txHash) {
    $.ajax({
        url: `/api/transactions/${txHash}/`,
        method: 'GET',
        success: function(data) {
            $('#transactionModal .modal-body').html(`
                <div class="transaction-details">
                    <h5>Transaction Details</h5>
                    <p><strong>Hash:</strong> ${data.transaction_hash}</p>
                    <p><strong>Type:</strong> ${data.transaction_type}</p>
                    <p><strong>Status:</strong> <span class="badge badge-${data.status === 'CONFIRMED' ? 'success' : 'warning'}">${data.status}</span></p>
                    <p><strong>Sender:</strong> ${data.sender}</p>
                    <p><strong>Receiver:</strong> ${data.receiver || 'N/A'}</p>
                    <p><strong>Shard:</strong> ${data.shard}</p>
                    <p><strong>Created:</strong> ${new Date(data.created_at).toLocaleString()}</p>
                    <p><strong>Data Size:</strong> ${(data.data_size / 1024).toFixed(2)} KB</p>
                    ${data.offchain_storage_ref ? `<p><strong>Off-chain Reference:</strong> ${data.offchain_storage_ref}</p>` : ''}
                </div>
            `);
            $('#transactionModal').modal('show');
        }
    });
}

// --- Global Consensus Monitor Functions ---

function handleGlobalConsensusUpdate(data) {
    const roundId = data.round;
    const status = data.status;
    const phase = data.phase;
    
    // 1. Update the status badge in the table (using data-round-id attribute)
    const row = $(`tr[data-round-id="${roundId}"]`);
    if (row.length) {
        // Update status badge
        const badgeCell = row.find('.status-badge-cell');
        if (badgeCell.length) {
            badgeCell.html(getGlobalStatusBadge(status));
        }
        
        // Update progress bar
        const progressBar = row.find('.progress-bar');
        if (progressBar.length) {
            const progress = (phase / 4) * 100;
            progressBar.css('width', `${progress}%`);
        }
    }

    // 2. Update the PBFT Timeline if we are on the consensus page
    if (window.location.pathname === '/consensus/') {
        updateGlobalPBFTTimeline(phase);
        
        // 3. If finished, refresh to move to history
        if (status === 'DECIDED' || status === 'FAILED') {
            setTimeout(() => {
                if (typeof loadConsensusData === 'function') loadConsensusData();
            }, 2000);
        }
    }
}

function updateGlobalPBFTTimeline(phase) {
    $('.pbft-phase').removeClass('active');
    if (phase >= 1) $('.phase-1').addClass('active');
    if (phase >= 2) $('.phase-2').addClass('active');
    if (phase >= 3) $('.phase-3').addClass('active');
    if (phase >= 4) $('.phase-4').addClass('active');
}

function getGlobalStatusBadge(status) {
    const badges = {
        'PRE_PREPARE': '<span class="badge bg-primary">Pre-prepare</span>',
        'PREPARE': '<span class="badge bg-warning text-dark">Prepare</span>',
        'COMMIT': '<span class="badge bg-info">Commit</span>',
        'DECIDED': '<span class="badge bg-success">Decided</span>',
        'FAILED': '<span class="badge bg-danger">Failed</span>'
    };
    return badges[status] || `<span class="badge bg-secondary">${status}</span>`;
}